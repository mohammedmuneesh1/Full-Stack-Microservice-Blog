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
        blogs = await sql `SELECT * FROM blogs WHERE title LIKE '%' || ${searchQuery} || '%' OR description LIKE '%' || ${searchQuery} || '%' AND category LIKE '%' || ${category} || '%' ORDER BY createdAt DESC LIMIT 10 `;
    }
    else if (searchQuery){
        blogs = await sql `SELECT * FROM blogs WHERE title LIKE '%' || ${searchQuery} || '%' OR description LIKE '%' || ${searchQuery} || '%' ORDER BY createdAt DESC LIMIT 10 `;
    }
    else if(category) {
        blogs = await sql `SELECT * FROM blogs WHERE category LIKE '%' || ${category} || '%'  ORDER BY createdAt DESC LIMIT 10 `;
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


export async function GET_SINGLE_BLOG_CONTROLLER(req: AuthenticatedRequest, res: Response):Promise<Response>{
    const blogId = req.params.id;
    const token = req.headers.authorization!;
       console.log('request erached ')
    const cacheKey = `blogById:${blogId}`;
    const cached = await redisClientConfig.get(cacheKey);
    if(cached){
        console.info(`blogById from cache redis`)
        return ResponseHandler(res,200,true,JSON.parse(cached),'Blog fetched successfully');
    }





    if(!blogId) return ResponseHandler(res,200,false,null,'Blog Id not found. Please it pass it as params.');
    const blog = await sql `SELECT * FROM blogs WHERE id=${blogId}`;
    if(!blog || blog.length === 0) {
         return ResponseHandler(res,200,false,null,'No blog was found for the provided ID.');
     }
     const userServiceApi = process.env.USER_SERVICE_API as string;
    if(!userServiceApi) {
         return ResponseHandler(res,200,false,null,'User service api not found.');
    }

    const {data} = await axios.get(
        `${userServiceApi}/api/users/u-profile/${blog[0]!.author}`,
           {
             headers: {
            Authorization: token
        }
    }
    );

    if(!data?.success){
    return ResponseHandler(res,200,false,null,data?.response ? data?.response : 'User not found.');
    }

    const finalData = {
        ...blog[0],
        author: data?.data
    }

   

    await redisClientConfig.set(cacheKey,JSON.stringify(finalData),{
        EX:3600
    });

     console.info('calling from the db')

    return ResponseHandler(res,200,true,finalData,'Blog fetched successfully');
}






    //-------------------------------------------------- GET SINGLE BLOG END ---------------------------------------------------------------------------------