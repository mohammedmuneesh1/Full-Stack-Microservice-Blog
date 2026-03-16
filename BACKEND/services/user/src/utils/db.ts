import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL as string,{
            maxPoolSize: 50, // Maximum number of connections in the pool
            serverSelectionTimeoutMS: 10000, // Timeout after 10s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        });

        console.log("DB connected 123");
    } catch (error) {
        console.log(error);
    }
}

export default connectDB;