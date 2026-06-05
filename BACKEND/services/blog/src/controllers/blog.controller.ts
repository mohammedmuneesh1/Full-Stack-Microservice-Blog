import type { Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/isAuth.js";
import ResponseHandler from "../utils/responseHandler.js";
import sql from "../config/neonConnectDB.js";
import axios from "axios";
import { redisClientConfig } from "../config/redisConnect.js";


//-------------------------------------------------- CREATE NEW BLOG START ---------------------------------------------------------------------------------
/**
 * @desc    Get all blogs of limit 10 (may be change later for the limit )
 * @route   GET /api/blogs/all
 * @access  Private
 * @returns  return array of all blogs
 */



export async function GET_ALL_BLOGS_CONTROLLERS(req: AuthenticatedRequest, res: Response):Promise<Response>{
    const {searchQuery="",category=""} = req.query;

    console.log('searchQuery',searchQuery,'category',category);

    const cacheKey = `blogs:${searchQuery}:${category}`;

    console.log('cacheKey',cacheKey);

    const cached = await redisClientConfig.get(cacheKey);



    if(cached){
        //normal db query speed 3.4s 
        // cached query speed 871ms 
        console.info(`it's from the cache. redis  `)
        return ResponseHandler(res,200,true,JSON.parse(cached),'All Blogs fetched successfully');
    }

    

    



    let blogs; 

    if(searchQuery && category){
        blogs = await sql `SELECT * FROM blogs WHERE title ILIKE '%' || ${searchQuery} || '%' OR description ILIKE '%' || ${searchQuery} || '%' AND category ILIKE '%' || ${category} || '%' ORDER BY createdAt DESC LIMIT 20 `;
    }
    else if (searchQuery){
        console.log('searchQuery',searchQuery);
        blogs = await sql `SELECT * FROM blogs 
        WHERE title ILIKE '%' || ${searchQuery} || '%' OR description ILIKE '%' || ${searchQuery} || '%' ORDER BY createdAt DESC LIMIT 20 `;
    }
    else if(category) {
        blogs = await sql `SELECT * FROM blogs WHERE category ILIKE '%' || ${category} || '%'  ORDER BY createdAt DESC LIMIT 20 `;
    }
    else{
        blogs =await sql `SELECT * FROM blogs ORDER BY createdAt DESC LIMIT 10`;
    }


    await redisClientConfig.set(cacheKey,JSON.stringify(blogs),{
        EX:3600
    });
    return ResponseHandler(res,200,true,blogs,'All Blogs fetched successfully');
}




//-------------------------------------------------- CREATE NEW BLOG END ---------------------------------------------------------------------------------

//-------------------------------------------------- GET SINGLE BLOG START ---------------------------------------------------------------------------------
/**
 * @desc    Get single blog
 * @route   GET /api/blogs/:id
 * @access  Private
 * @returns  single blog object OR  null if nothing exist 
 */


export async function GET_SINGLE_BLOG_CONTROLLER(
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> {
  const blogId = req.params.id;

  if (!blogId) {
    return ResponseHandler(
      res,
      400,
      false,
      null,
      "Blog ID is required."
    );
  }

  const token = req.headers.authorization!;

  const cacheKey = `blogById:${blogId}`;

  let blogData: any;

  const cached = await redisClientConfig.get(cacheKey);

  if (cached) {
    blogData = JSON.parse(cached);
  } else {
    const blog = await sql`
      SELECT *
      FROM blogs
      WHERE id = ${blogId}
    `;

    if (!blog || blog.length === 0) {
      return ResponseHandler(
        res,
        404,
        false,
        null,
        "No blog was found for the provided ID."
      );
    }

    const userServiceApi = process.env.USER_SERVICE_API;

    if (!userServiceApi) {
      return ResponseHandler(
        res,
        500,
        false,
        null,
        "User service API not configured."
      );
    }

    const { data } = await axios.get(
      `${userServiceApi}/api/users/u-profile/${blog[0]!.author}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (!data?.success) {
      return ResponseHandler(
        res,
        404,
        false,
        null,
        data?.response || "User not found."
      );
    }

    blogData = {
      ...blog[0],
      author: data.data,
    };

    await redisClientConfig.set(
      cacheKey,
      JSON.stringify(blogData),
      {
        EX: 3600,
      }
    );
  }

  const savedBlog = await sql`
    SELECT 1
    FROM savedblogs
    WHERE blogId = ${blogId}
    AND userId = ${req.user?.id}
    LIMIT 1
  `;

  const finalData = {
    ...blogData,
    isBlogSaved: savedBlog.length > 0,
  };

  return ResponseHandler(
    res,
    200,
    true,
    finalData,
    "Blog fetched successfully"
  );
}






    //-------------------------------------------------- GET SINGLE BLOG END ---------------------------------------------------------------------------------
    
    
    //-------------------------------------------------- GET BLOG COMMENTS START ---------------------------------------------------------------------------------

    export async function GET_BLOG_COMMENT_BY_ID (req: AuthenticatedRequest, res:Response):Promise<Response>{
        const blogId = req.params.id;
        const comments = await sql `SELECT * FROM comments WHERE blogId=${blogId} ORDER BY createdAt DESC`;
        return ResponseHandler(res,200,true,comments,'Comments fetched successfully');
    }



    export const ADD_COMMENT = async (req: AuthenticatedRequest, res:Response):Promise<Response> => {
        const {id} = req.params;
        const {comment} = req.body;
        console.log("id",id);
        const token = req.headers.authorization!;
       const result =  await sql `INSERT INTO comments (comment,blogId,userid,username) VALUES (${comment},
        ${id},${req.user?.id},${req.user?.name}) RETURNING *`;
       return ResponseHandler(res,200, true, result ? result[0] : null, 'Comment added successfully');
    }



    export const DELETE_COMMENT = async (req: AuthenticatedRequest, res:Response):Promise<Response> => {
        const {id} = req.params;
        const {commentId} = req.params;
        const token = req.headers.authorization!;
        const result =  await sql `DELETE FROM comments WHERE id=${commentId} AND blogId=${id} AND userId=${req.user?.id} RETURNING *`;
         if(!result){
            return ResponseHandler(res,200, false, null, 'Comment not found');
        }
        return ResponseHandler(res,200, true, result ? result[0] : null, 'Comment deleted successfully');
    }
    //-------------------------------------------------- GET BLOG COMMENTS END ---------------------------------------------------------------------------------

    export const SAVE_BLOG_CONTROLLER =  async (req: AuthenticatedRequest, res:Response):Promise<Response> => {
        const {id} = req.params;
        console.log('request reached here')
        const userId = req.user?.id;
        if(!id || !userId) {
            return ResponseHandler(res,200,false,null,'Blog Id not found. Please it pass it as params.');
        }
        const token = req.headers.authorization!;
        // const result =  await sql `INSERT INTO savedblogs (blogId,userId) VALUES (${id},${userId}) RETURNING *`;
        const isExisting = await sql `SELECT * FROM savedblogs WHERE blogId=${id} AND userId=${userId}`;
        if(isExisting.length === 0){
            const result =  await sql `INSERT INTO savedblogs (blogId,userId) VALUES (${id},${userId}) RETURNING *`;
            return ResponseHandler(res,200, true, result ? result[0] : null, 'Blog saved successfully');
        }
        else{
            const result =  await sql `DELETE FROM savedblogs WHERE blogId=${id} AND userId=${userId} RETURNING *`;
            return ResponseHandler(res,200, true, result ? result[0] : null, 'Blog unsaved successfully');
        }
}


export const GET_ALL_SAVED_BLOGS = async (req: AuthenticatedRequest, res:Response):Promise<Response> => {
    const userId = req.user?.id;
    if(!userId) {
        return ResponseHandler(res,200,false,null,'Blog Id not found. Please it pass it as params.');
    }
    
  //returns only the blog columns. saved blogs column wont be there  
  const blogs = await sql`
  SELECT blogs.*
  FROM savedblogs
  JOIN blogs   
  ON blogs.id = savedblogs.blogId::integer
  WHERE savedblogs.userId = ${userId}`;

  ////JOIN blogs  ->  "Bring the blogs table into the query.", 
  // But PostgreSQL still doesn't know which blog belongs to which savedblog row.
  //ON blogs.id = savedblogs.blogId::integer ->  "Match the ID column of the blogs table with the blogId column of the savedblogs table."


  const blogs2 = await sql`
SELECT
    savedblogs.*,
    blogs.*
FROM savedblogs
JOIN blogs
ON blogs.id = savedblogs.blogId::integer
WHERE savedblogs.userId = ${userId}
`;
  
//blog 2 query will give kind of result including savedBlogs columns 
// blogs2 [
//   {
//     id: 11,
//     userid: '699cbb7069b8971dd7537400',
//     blogid: '11',
//     createdat: 2026-06-03T10:09:02.560Z,
//     updatedat: 2026-06-03T10:09:02.560Z,
//     title: 'dfafd',
//     description: 'afasdf',
//     blogcontent: '<p>asfasdfasd</p>',
//     image: {
//       url: 'https://res.cloudinary.com/mblog-cloud/image/upload/v1780501141/MICROSERVICE-BLOG/blogs/qg7xsnac8yzmkzmoylvd.png',
//       publicId: 'MICROSERVICE-BLOG/blogs/qg7xsnac8yzmkzmoylvd'
//     },
//     category: 'Travel',
//     author: '699cbb7069b8971dd7537400'
//   }
// ]

    return ResponseHandler(res,200, true, blogs, 'Saved blog fetched successfully');
}



    //-------------------------------------------------- GET OWN BLOGS  ---------------------------------------------------------------------------------

    export const GET_OWN_BLOGS = async (req: AuthenticatedRequest, res:Response):Promise<Response> => {

        const userId = req.user?.id;
        if(!userId){
            return ResponseHandler(res,200,false,null,'User not found. Please it pass it as params.');
        }
        const blogs = await sql `SELECT * FROM blogs WHERE author=${userId}`;
        return ResponseHandler(res,200,true,blogs,'User own blog fetched successfully.')
    }
