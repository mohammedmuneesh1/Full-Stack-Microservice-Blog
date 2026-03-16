import type { Request, Response } from "express";
import ResponseHandler from "../utils/responseHandler.js";
import type { UploadApiResponse } from "cloudinary";
import cloudinaryOptions from "../utils/cloudinaryManagement.js";
import sql from "../config/neonConnectDB.js";
import type { AuthenticatedRequest } from "../middleware/isAuth.js";
import cloudinaryManagment from "../utils/cloudinaryManagement.js";
import { invalidateCacheJob } from "../utils/rabbitMq.js";




//-------------------------------------------------- CREATE NEW BLOG START ---------------------------------------------------------------------------------

/**
 * @desc    post CREATE NEW BLOG 
 * @route   post /api/authors/
 * @access  Private
 * @returns  blog object
 */
export async function CREATE_BLOG_CONTROLLER(
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> {
  const userId = req.user?.id;

  if (!userId) {
    return ResponseHandler(
      res,
      200,
      false,
      null,
      "User not found. Please login again."
    );
  }
  const { title, description, blogContent, category } = req.body;

  console.log("req.body", req.body);

  const file = req.file;

  if (!file) {
    return ResponseHandler(res, 200, false, null, "Blog Image File required");
  }


  //======================CLOUDINARY UPLOAD START 
  const cloudinaryResult: UploadApiResponse | undefined =
    await cloudinaryOptions.uploadItem(file.buffer, "blogs");
  if (!cloudinaryResult) {
    return ResponseHandler(
      res,
      200,
      false,
      null,
      "Image upload has been failed. Please try again later."
    );
  }

  //======================CLOUDINARY UPLOAD END 
  const result = await sql`INSERT INTO blogs
     (title,description,blogContent,image,category,author) 
     VALUES
      (${title},${description},${blogContent},${{
    url: cloudinaryResult.secure_url,
    publicId: cloudinaryResult.public_id,
  }},
      ${category},${userId}) RETURNING *`;

      await invalidateCacheJob(["blogs:*"])
   //blogs:*  →  “Give me ALL keys that START with 'blogs:'”



  return ResponseHandler(
    res,
    200,
    true,
    result[0],
    "Blog created successfully"
  );
  ``;
}
//-------------------------------------------------- CREATE NEW BLOG END ---------------------------------------------------------------------------------

//-------------------------------------------------- UPDATE BLOG START ---------------------------------------------------------------------------------
/**
 * @desc    put UDPATE EXISTING BLOG 
 * @route   put /api/authors/:id
 * @access  Private
 * @returns  udpated blog object
 **/

export async function UPDATE_BLOG_CONTROLLER(req: AuthenticatedRequest, res: Response):Promise<Response> {
  const blogId = req.params.id;
  const userId = req.user?.id;

  if(!blogId){
    return ResponseHandler(res,200,false,null,'Blog Id not found. Please it pass it as params.');
  }

  if(!userId){
    return ResponseHandler(res,200,false,null,'User not found. Please login again.');
  }

  const { title, description, blogContent, category } = req.body;
  const file = req.file;
  const blogRows = await sql ` SELECT * FROM blogs WHERE id=${blogId} `;

//   const blog = await sql `SELECT * FROM blogs WHERE id=${blogId} AND author=${userId}`;
if (!blogRows || blogRows.length === 0) {
  return ResponseHandler(
    res,
    200,
    false,
    null,
    "No blog was found for the provided ID and author."
  );
}

  if(blogRows[0]!.author !== userId){
    return ResponseHandler(res,200,false,null,"You're not author of this blog.  ." );
  }
  
  let newUpdatedImageResult:null | {url:string,publicId:string}= null;

  if(file){
    const cloudinaryResult = await cloudinaryManagment.uploadItem(file.buffer,"blogs");
    if(!cloudinaryResult){
      return ResponseHandler(res,200,false,null,"Image upload has been failed. Please try again later.");
    }
    newUpdatedImageResult = {
      url:cloudinaryResult.secure_url,
      publicId:cloudinaryResult.public_id
    }
    await cloudinaryManagment.deleteItem(blogRows[0]!.image.publicId);
  }


  const updatedBlog = await sql `UPDATE blogs SET title=${title || blogRows[0]!.title}
  ,description=${description || blogRows[0]!.description},
  blogContent=${blogContent || blogRows[0]!.blogContent},
  image=${newUpdatedImageResult ? JSON.stringify(newUpdatedImageResult) : blogRows[0]!.image
  },category=${category || blogRows[0]!.category} WHERE id=${blogId} RETURNING *`;

  await invalidateCacheJob(["blogs:*",`blogById:${blogId}`]);
  //`blogById:${blogId}`

  return ResponseHandler(res,200,false,updatedBlog,"Blog Updated Successfully ");
}
//-------------------------------------------------- UPDATE BLOG END ---------------------------------------------------------------------------------

//-------------------------------------------------- DELETE BLOG START ---------------------------------------------------------------------------------
/**
 * @desc    delete DELETE EXISTING BLOG 
 * @route   delete /api/authors/:id
 * @access  Private
 * @returns  null
 **/
export async function DELETE_BLOG_CONTROLLER(req: AuthenticatedRequest, res: Response):Promise<Response> {
  const blogId = req.params.id;
  const userId = req.user?.id;

  if(!blogId){
    return ResponseHandler(res,200,false,null,'Blog Id not found. Please it pass it as params.');
  }

  if(!userId){
    return ResponseHandler(res,200,false,null,'User not found. Please login again.');
  }

    const blogRows = await sql ` SELECT * FROM blogs WHERE id=${blogId} `;

//   const blog = await sql `SELECT * FROM blogs WHERE id=${blogId} AND author=${userId}`;
if (!blogRows || blogRows.length === 0) {
  return ResponseHandler(
    res,
    200,
    false,
    null,
    "No blog was found for the provided ID and author."
  );
}



  if(blogRows[0]!.author !== userId){
    return ResponseHandler(res,200,false,null,"You're not author of this blog.  ." );
  }


  await sql `DELETE FROM savedblogs WHERE blogId=${blogId}`;
  await sql `DELETE FROM comments WHERE blogId=${blogId}`;
  await sql `DELETE FROM blogs WHERE id=${blogId}`;
  await cloudinaryManagment.deleteItem(blogRows[0]!.image.publicId);

    await invalidateCacheJob(["blogs:*",`blogById:${blogId}`]);
  
  return ResponseHandler(res,200,true,null,'Blog Deleted Successfully ');
}

//-------------------------------------------------- DELETE BLOG END ---------------------------------------------------------------------------------