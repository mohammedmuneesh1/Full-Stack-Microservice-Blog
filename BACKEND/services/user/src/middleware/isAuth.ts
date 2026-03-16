import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from 'jsonwebtoken'


export interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}
export default async function isAuth(req:Request, res:Response, next:NextFunction) {
    try {
        const bearerToken = req.headers.authorization;

        if(!bearerToken || !bearerToken.startsWith('Bearer ')){ {
            return res.status(401).json({
                success:false,
                message:'Unauthorized'
            })
        }
        }
        const token = bearerToken.split(' ')[1];
        if(!token || typeof token !== "string") {
            return res.status(401).json({
                success:false,
                message:'Unauthorized'
            });
        }
        const decoded = jwt.verify(token as string,process.env.JWT_SECRET as string) as JwtPayload;
        if(!decoded){
            return res.status(401).json({
                success:false,
                message:'Unauthorized'
            });
        }

         (req as AuthenticatedRequest).user = decoded;
        next();
        
    } catch (error) {
        console.error(`Error occured on auth:${error instanceof Error ? error.message : error}`);
        if(error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                success:false,
                message:'Unauthorized'
            });
        }
        if(error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                success:false,
                message:'Unauthorized'
            });
        }
        return res.status(401).json({
            success:false,
            message:'Unauthorized'
        });
    }

}  



