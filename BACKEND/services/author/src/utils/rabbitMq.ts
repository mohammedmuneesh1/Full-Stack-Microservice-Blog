import amqp from "amqplib";

let channel:amqp.Channel;

export const connectRabbitMQAuthor = async ()=>{
    try {
        const connection = await amqp.connect({
            protocol: "amqp",
            hostname: "localhost",
            port: 5672,
            username:'guest',
            password:'guest',
        });

        channel = await connection.createChannel();
        console.log('Connected to RabbitMQ on author');
    } catch (error) {
        console.log('Failed to connect to RabbitMQ on author',error);
    }
    // process.env.RABBITMQ_URL as string
}


export const publishToQueue  = async (queueName:string, message:any) => {
if(!channel){
    console.error("RabbitMq channel is not initialized");
    return;
}

//`assertQueue` means *"make sure this queue exists, create it if it doesn't."* Both sides call it defensively because **you don't know which service starts first**. If the blog service starts before the author service, the queue needs to already exist so messages aren't lost.

await channel.assertQueue(queueName, {durable:true});

//“ {durable:true}  If the broker restarts, do not delete this queue.”
//Durable = queue survives broker restart
//Not durable = queue vanishes on restart

channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)),{
    persistent: true
});

};




export const invalidateCacheJob = async (cacheKeys:string[])=>{
    try {
        const message = {
            action:'invalidateCache',
            keys:cacheKeys,
        };
        await publishToQueue('cache-invalidation',message);
        console.log("✅ Cache Invalidation Job published to RabbitMQ")

    } catch (error) {
        console.log("❌ Cache Invalidation Job failed to publish to RabbitMQ",error instanceof Error ? error.message : error);
        
    }
}




