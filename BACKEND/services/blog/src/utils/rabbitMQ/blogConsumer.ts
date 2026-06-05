import amqp from "amqplib";
import { Console } from "console";
import { redisClientConfig } from "../../config/redisConnect.js";
import sql from "../../config/neonConnectDB.js";


interface CacheInvalidationMessage{
    action:string,
    keys:string[],
}

let channel:amqp.Channel;

export const startCacheConsumer = async ()=>{
    try {
            const connection = await amqp.connect({
            protocol: "amqp",
            hostname: "localhost",
            port: 5672,
            username:'guest',
            password:'guest',
        });

        channel = await connection.createChannel();

         //⚠️⚠️ CHECK rabbitMQ.md for theory 

         
        const queueName = 'cache-invalidation';
        await channel.assertQueue(queueName, {durable:true});
        console.log('✅  Blog Service RabitMQ Cache consumer started ')

        //=================================== consume 👉 Messages are handled one by one by default.  ===================================
        channel.consume(queueName, async (message) => {

            if(message){
                try {
                    const content = JSON.parse(message.content.toString()) as CacheInvalidationMessage;
                 //content will be look like {action:'invalidateCache', keys:["blogs:*",`blogById:${blogId}`] }


                    console.log('📩 blog service received cache invalidation message',content);
                    if(content.action === 'invalidateCache'){
                        for (const pattern of content.keys) {
                            //   //blogs:*  →  “Give me ALL keys that START with 'blogs:'”
                            //⚠️ example for understanding [blogs:* ]
                            //content.keys will be an array  
                            const keys = await redisClientConfig.keys(pattern);
                            //the result of keys [ "blogs:","blogs:tech","blogs:sports","blogs:search:react","blogs::category:js"]

                            if(keys.length > 0){
                                await redisClientConfig.del(keys);
                                //then delete all the keys 
                                console.log(` 🗑️ blog service invalidated ${keys.length} cache keys matching:${pattern} `);
                                const searchQuery = "";
                                const  category = "";
                                const cacheKey = `blogs:${searchQuery}:${category}`;
                                const blogs = await sql `SELECT * FROM blogs ORDER BY createdAt DESC  `;
                                await redisClientConfig.set(cacheKey,JSON.stringify(blogs),{
                                    EX:3600, // expires in 1 hour
                                });
                                console.log('🔄️ Cache rebuilt with key:',cacheKey);
                            }
                        }
                    }
                  channel.ack(message);
                } catch (error) {
                        console.error('📩 blog service failed to receive cache invalidation message',error instanceof Error ? error.message : error);    
                        channel.nack(message,false,true);
                }
            }
        });

        //=================================== consume 👉 Messages are handled one by one by default. end  ===================================

    } catch (error) {
               console.error('📩 blog consumer message-broker failed',error instanceof Error ? error.message : error);    

    }
}


// let channel:amqp.Channel;

// export const connectRabbitMQAuthor = async ()=>{
//     try {
//         const connection = await amqp.connect({
//             protocol: "amqp",
//             hostname: "localhost",
//             port: 5672,
//             username:'guest',
//             password:'guest',
//         });
//         channel = await connection.createChannel();
//         console.log('Connected to RabbitMQ on author');
//     } catch (error) {
//         console.log('Failed to connect to RabbitMQ on author',error);
//     }
//     // process.env.RABBITMQ_URL as string
// }


// export const publishToQueue  = async (queueName:string, message:any) => {
// if(!channel){
//     console.error("RabbitMq channel is not initialized");
//     return;
// }
// await channel.assertQueue(queueName, {durable:true});

// //“ {durable:true}  If the broker restarts, do not delete this queue.”
// //Durable = queue survives broker restart
// //Not durable = queue vanishes on restart

// channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)),{
//     persistent: true
// });


// };



// export const invalidateCacheJob = async (cacheKeys:string[])=>{
//     try {
//         const message = {
//             action:'invalidateCache',
//             keys:cacheKeys,
//         };

//         await publishToQueue('cache-invalidation',message);

//         console.log("✅ Cache Invalidation Job published to RabbitMQ")

//     } catch (error) {
//         console.log("❌ Cache Invalidation Job failed to publish to RabbitMQ",error instanceof Error ? error.message : error);
        
//     }
// }
