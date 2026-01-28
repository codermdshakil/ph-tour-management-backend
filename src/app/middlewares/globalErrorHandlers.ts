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
  next: NextFunction,
) => {
  let statusCode = 500;
  let message = "Someting want wrong!";
  const errorSources: any = [];

  //  এর মানে হল err যদি  AppError  এর object হয় তাহলে  statusCode, message গুলু value পরিবর্তন হবে

  // mongoose duplicate error handle
  if (err.code === 11000) {
    const matchedArray = err.message.match(/"([^"]*)"/);

    statusCode = 400;
    message = `Email ${matchedArray[1]} already Exist!`;
  }
  // mongoose ObjectId Error / CastError
  else if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid MongoDB objectID, Please Provide a valid ObjectID";
  }
  // Zod Error
  else if (err.name === "ZodError") {
    message = "Zod Error!";
    statusCode = 400;

    const errorsObject = JSON.parse(err);

    errorsObject.forEach((errorObject: any) => {

      errorSources.push({
        path:errorObject.path.length > 1 ? errorObject.path.slice().reverse().join(" inside ") : errorObject.path[0],
        message: errorObject.message,
      });
    });
  }
  // Mongoose Validation Error
  else if (err.name === "ValidationError") {
    statusCode = 400;
    const errors = Object.values(err.errors);

    errors.forEach((errorObject: any) =>
      errorSources.push({
        path: errorObject.path,
        message: errorObject.message,
      }),
    );
    message = "Validation Error!";
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    //  এর মানে হল err যদি  Error  এর object হয় তাহলে  statusCode, message গুলু value পরিবর্তন হবে
    statusCode = 500;
    message = err.message;
  }

  res.status(statusCode).json({
    message,
    errorSources,
    err,
    stack: envVars.NODE_ENV === "development" ? err.stack : null,
  });
};
