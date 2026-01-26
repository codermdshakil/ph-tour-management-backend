/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHanlers/AppError";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Someting want wrong!";


  console.log(err, "from global error!");

  //  এর মানে হল err যদি  AppError  এর object হয় তাহলে  statusCode, message গুলু value পরিবর্তন হবে
 
  if(err.code === 11000){
    statusCode = 400
    message = `${err.errorResponse.keyValue.email} already Exist!`;

  }
  else if (err instanceof AppError) {

    statusCode = err.statusCode;
    message = err.message;

  } else if (err instanceof Error) {

    //  এর মানে হল err যদি  Error  এর object হয় তাহলে  statusCode, message গুলু value পরিবর্তন হবে
    statusCode = 500;
    message = err.message;
  }

  res.status(statusCode).json({
    message,
    err,
    stack: envVars.NODE_ENV === "development" ? err.stack : null,
  });
};
