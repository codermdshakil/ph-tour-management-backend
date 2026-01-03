/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserServices } from "./user.service";

// create user
export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await UserServices.createUser(req.body);

    res.status(StatusCodes.CREATED).json({
      message: "User created successfully!",
      user: user,
    });

  } catch (err: any) {
    console.log(err);
    res.status(StatusCodes.BAD_REQUEST).json({
      message: `Something want wrong!! ${err.message}`,
      err: err,
    });
  }
};

export const UserControllers = {
  createUser,
};

// route matching - controller - service - model - DB
 
