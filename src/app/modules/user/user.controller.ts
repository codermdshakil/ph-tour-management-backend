/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { UserServices } from "./user.service";

// create user normal async
// export const createUser = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     // throw new Error("Fake Error");
//     // throw new AppError(StatusCodes.BAD_REQUEST, "Fake error");

//     const user = await UserServices.createUser(req.body);

//     res.status(StatusCodes.CREATED).json({
//       message: "User created successfully!",
//       user: user,
//     });
//   } catch (err: any) {
//     // ##  normal error handle
//     // res.status(StatusCodes.BAD_REQUEST).json({
//     //   message: `Something want wrong!! ${err.message}`,
//     //   err: err,
//     // });

//     // ##  global error handle
//     next(err);
//   }
// };

// create user using CatchAsync
const createUser = catchAsync( async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);

    res.status(StatusCodes.CREATED).json({
      success:true,
      message: "User created successfully!",
      user: user,
    });
  }
);

// getAllUser
const getAllUsers = catchAsync( async (req: Request, res: Response, next: NextFunction) => {

    const users = await UserServices.getAllUsers();

    res.status(StatusCodes.OK).json({
      success:true,
      message: "All user retrived successfully!",
      users
    });
  }
);

export const UserControllers = {
  createUser,
  getAllUsers
};

// route matching - controller - service - model - DB
