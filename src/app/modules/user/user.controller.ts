/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserServices } from "./user.service";

// create user
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    // throw new Error("Fake Error");
    // throw new AppError(StatusCodes.BAD_REQUEST, "Fake error");

    const user = await UserServices.createUser(req.body);

    res.status(StatusCodes.CREATED).json({
      message: "User created successfully!",
      user: user,
    });

  } catch (err: any) {

    // ##  normal error handle
    // res.status(StatusCodes.BAD_REQUEST).json({
    //   message: `Something want wrong!! ${err.message}`,
    //   err: err,
    // });

    // ##  global error handle
    next(err);
  }
};

export const UserControllers = {
  createUser,
};

// route matching - controller - service - model - DB
