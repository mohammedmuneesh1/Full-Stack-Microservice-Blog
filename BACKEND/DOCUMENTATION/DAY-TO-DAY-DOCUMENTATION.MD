




//---------------------------------------- 04-12-2025 START ------------------------------------------------------------

✔️ 1. If using Docker Compose in production

Use the container name, exactly like development:

MEDIA_SERVICE_URL=http://media-service:3002

Docker creates an internal DNS so containers can talk to each other.





  ---> neon db notes on readme.md 

  --> neon db is a serverless  database for relational database postgres 


Basically:
Structured → SQL → Relational → Postgres



Serverless ≠ “no servers.”
It just means you don’t manage the servers, and the compute wakes up only when needed.




//---------------------------------------- 04-12-2025 END ------------------------------------------------------------

//---------------------------------------- 07-12-2025 START ------------------------------------------------------------


//RABBIT MQ INSTALLATION ON BLOG 


2) 
ILIKE is LIKE but with forced case-insensitivity, you curious menace.
    if(searchQuery && category){
        blogs = await sql `SELECT * FROM blogs WHERE title LIKE '%' || ${searchQuery} || '%' OR description LIKE '%' || ${searchQuery} || '%' AND category LIKE '%' || ${category} || '%' ORDER BY createdAt DESC LIMIT 10 `;
    }
    else if (searchQuery){
        blogs = await sql `SELECT * FROM blogs WHERE title LIKE '%' || ${searchQuery} || '%' OR description LIKE '%' || ${searchQuery} || '%' ORDER BY createdAt DESC LIMIT 10 `;
    }
    else if(category) {
        console.log("inside here");

        blogs = await sql `SELECT * FROM blogs WHERE category LIKE '%' || ${category} || '%'  ORDER BY createdAt DESC LIMIT 10 `;
    }
    else{
        blogs =await sql `SELECT * FROM blogs ORDER BY createdAt DESC LIMIT 10`;
    }

3) insalled cors on user service for internal api 

export async function GET_SINGLE_BLOG_CONTROLLER(req: AuthenticatedRequest, res: Response):Promise<Response>{
    const blogId = req.params.id;
    const token = req.headers.authorization!;
    if(!blogId) return ResponseHandler(res,200,false,null,'Blog Id not found. Please it pass it as params.');
    const blog = await sql `SELECT * FROM blogs WHERE id=${blogId}`;
    if(!blog || blog.length === 0) return ResponseHandler(res,200,false,null,'No blog was found for the provided ID.');
    const userServiceApi = process.env.USER_SERVICE_API as string;
    if(!userServiceApi) return ResponseHandler(res,200,false,null,'User service api not found.');
    
    
    console.log('blog author ',blog[0]!.author)
    const {data} = await axios.get(
        `${userServiceApi}/api/users/u-profile/${blog[0]!.author}`,
           {
             headers: {
            Authorization: token
        }
    }
    );
    if(!data?.success) return ResponseHandler(res,200,false,null,'User not found.');
    blog[0]!.author = {
        ...data?.data
    };
    return ResponseHandler(res,200,true,blog[0],'Blog fetched successfully');
}




4)     const token = req.headers.authorization!; (to get token inside controller.)


5) created account for upstash  for redis  
redisConnect.ts 
import { createClient } from "redis";



if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is not defined");
}

export const redisClientConfig =  createClient({
  url: process.env.REDIS_URL as string,
});

redisClientConfig.connect().then(()=>{
    console.log('Connected to redis')
}).catch((err)=>{
    console.log(err);
});









//---------------------------------------- 07-12-2025 END ------------------------------------------------------------