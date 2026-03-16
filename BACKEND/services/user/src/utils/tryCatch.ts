import type { NextFunction, Request, RequestHandler, Response } from "express";
import ErrorHandler from "./errorHandler.js";

const tryCatch = (handler:RequestHandler):RequestHandler => {
    return async (req:Request, res:Response, next:NextFunction) => {
        try {
            await handler(req, res, next);
        } catch (error) {
            return ErrorHandler(res, error, handler.name);
        }
    }
}

export default tryCatch;