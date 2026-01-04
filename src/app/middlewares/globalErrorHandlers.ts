/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";


export const globalErrorHandler = (err:any, req:Request, res:Response, next:NextFunction) => {

  const statusCode = 500;
  const message = `Something want wrong! ${err.message} from Global Error Handler!`;

  res.status(statusCode).json({
    message,
    err,
    stack: envVars.NODE_ENV === "development" ? err.stack : null
  });

}