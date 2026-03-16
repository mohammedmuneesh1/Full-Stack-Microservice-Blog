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




