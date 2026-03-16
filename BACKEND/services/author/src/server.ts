
import express, { type Request, type Response } from 'express'
import ErrorHandler from './utils/errorHandler.js';
// import { router as UserRoutes } from './routes/user.route.js';
import type { JwtPayload } from 'jsonwebtoken';
import sql from './config/neonConnectDB.js';
import authorRouter from './routes/author.route.js';
import { connectRabbitMQAuthor } from './utils/rabbitMq.js';
import cors from 'cors';



const app = express();
app.use(express.json());
app.use(cors());


connectRabbitMQAuthor();


const PORT = process.env.PORT;
if(!PORT) {
    throw new Error('PORT is not defined');
}





app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl},`);
  
  next();
});

app.use('/api/authors',authorRouter);

app.use((req:Request, res:Response) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

interface CustomError extends Error {
  statusCode?: number;
}


app.use((err:CustomError, req:Request, res:Response,) => {
  console.error(err.stack);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});


//-------------------------- NEON TESTING  START ---------------------------------------------

async function initDB(){
  try {
    await sql `
    CREATE TABLE IF NOT EXISTS blogs(
      id SERIAL PRIMARY KEY,    
      title VARCHAR(255) NOT NULL,
      description VARCHAR(255) NOT NULL,
      blogContent TEXT NOT NULL,
      image JSONB ,
      category VARCHAR(255) NOT NULL,
      author VARCHAR(255) NOT NULL,
      createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`

      await sql `
    CREATE TABLE IF NOT EXISTS comments(
      id SERIAL PRIMARY KEY,    
      comment VARCHAR(255) NOT NULL,
      userId VARCHAR(255) NOT NULL,
      username TEXT NOT NULL,
      blogId VARCHAR(255) NOT NULL,
      createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`
      

      await sql `
    CREATE TABLE IF NOT EXISTS savedblogs(
      id SERIAL PRIMARY KEY,    
      userId VARCHAR(255) NOT NULL,
      blogId VARCHAR(255) NOT NULL,
      createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`

      //⚠️⚠️⚠️ DONT PUT COMMA AT LAST ,) ERROR .   updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP )`  --> CORRECT 

      console.log("Database initialized successfully");
      //SERIAL in PostgreSQL creates an auto-incrementing integer
      //AFTER INITIALIZATION SUCCESS, CHECK NEON DB AS YOU CAN SEE THE TABLES CREATED 


} catch (error) {
  console.log("Error initDB",error instanceof Error ? error.message:error);
     throw new Error(String(error));
  }
}


//-------------------------- NEON TESTING  END ---------------------------------------------


initDB().then(() => {
    app.listen(PORT, () => {
            console.log(`author service listening on port ${PORT} in ${process.env.NODE_ENV} mode`);
   });
}).catch((error) => {
  console.log("Error initDB",error instanceof Error ? error.message:error);
});


 