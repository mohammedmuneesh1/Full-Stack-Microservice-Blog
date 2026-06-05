
import express, { type Request, type Response } from 'express'
import connectDB from './utils/db.js';
import { router as UserRoutes } from './routes/user.route.js';
import type { JwtPayload } from 'jsonwebtoken';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT;
if(!PORT) {
    throw new Error('PORT is not defined');
}



app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl},`);
  next();
});
app.use('/api/users',UserRoutes);


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


connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`User service listening on port ${PORT} in ${process.env.NODE_ENV} mode`);
        });
    })
    .catch((error) => {
        console.error('Failed to start server:', error);
        process.exit(1);
    });