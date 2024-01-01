import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { UserData } from "./IUser";

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