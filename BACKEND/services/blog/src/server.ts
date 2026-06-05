
import express, { type NextFunction, type Request, type Response } from 'express'
import BlogRoutes from './routes/blog.route.js';
import { startCacheConsumer } from './utils/rabbitMQ/blogConsumer.js';
import cors from 'cors';


const app = express();

app.use(express.json());
app.use(cors());


const PORT = process.env.PORT;

startCacheConsumer(); 


if(!PORT) {
    throw new Error('PORT is not defined');
}

if(!process.env.REDIS_URL) {
  throw new Error('REDIS_URL is not defined');
}


app.use((req:Request, res:Response, next:NextFunction) => {
  console.log(`[${req.method}] ${req.originalUrl},`);
  next();
});
app.use('/api/blogs',BlogRoutes);



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


// connectDB()
//     .then(() => {
//         app.listen(PORT, () => {
//             console.log(`User service listening on port ${PORT} in ${process.env.NODE_ENV} mode`);
//         });
//     })
//     .catch((error) => {
//         console.error('Failed to start server:', error);
//         process.exit(1);
//     });


  app.listen(PORT, () => {
            console.log(`BLOG SERVICE listening on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

