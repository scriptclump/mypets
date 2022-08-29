import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Unauthorized } from "../util/GeneralError";


export default async (req: Request, res: Response, next: NextFunction) => {
    let token: string = "";

    if (req.headers && req.headers.authorization) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        throw new Unauthorized("Unauthorized");
    }
    
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);   
    } catch (error) {
        return next(error);
    }

    try {
        // Database or api verification
        // Adding in request object for further usage [req.user = user]
        return next();
    } catch (error) {
        return next(error);
    }
};