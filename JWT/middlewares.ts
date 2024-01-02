import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { RegistrationRequest, VerifiedToken } from "./IUser";
import JWT from "jsonwebtoken";

export const validateUserType = (req: Request, res: Response, next: NextFunction) => {
    const requiredProperties: (keyof RegistrationRequest)[] = ['name', 'email', 'password', 'status'];
    const { ...userData }: RegistrationRequest = req.body;
    const missingProperties: (keyof RegistrationRequest)[] = [];
  
    requiredProperties.forEach((property) => {
      if (!userData[property]) {
        missingProperties.push(property);
      }
    });
  
    if (missingProperties.length === 0) {
      next();
    } else {
      res.status(400).json({
        error: true,
        message: "Invalid Request Body",
        missingProperties: missingProperties
      });
    }
  };
  

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.error('Error:', err);
  
    // Check if the error is a known type (e.g., Mongoose validation error)
    if (err.name === 'ValidationError') {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }

    res.status(500).json({ error: 'Internal Server Error' });
}

export const createErrorResponse = (res: Response, status: StatusCodes, message: string, error: Boolean) => {
    return res.status(status).json({
        error,
        message,
    });
};

declare global {
    namespace Express {
        interface Request {
            user?: VerifiedToken;
        }
    }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const userToken = req.headers.authorization    
    if(!userToken) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: true,
            message: "Token not found"
        })
    }

    const verifiedToken = JWT.verify(userToken, process.env.JWT_SECRET as string)    

    if (!verifiedToken) {
        return createErrorResponse(res, StatusCodes.UNAUTHORIZED, "Invalid token", true)
    }

    req.user = verifiedToken as VerifiedToken
    next()
}