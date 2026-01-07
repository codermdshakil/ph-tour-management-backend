/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
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
const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Succcessfully created a user!!",
      data: user,
    });
  }
);

// create user using CatchAsync
const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // userId
    const userId = req.params.id;
   
    const payload = req.body;

    // payload
    // decodedToken
    const verifiedToken = req.user;

    const user = await UserServices.updateUser(userId, payload, verifiedToken);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Succcessfully Updated a user!!",
      data: user,
    });
  }
);

// getAllUser
const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getAllUsers();

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "All user retrived successfully!",
      data: result.data,
      meta: result.meta,
    });
  }
);

export const UserControllers = {
  createUser,
  updateUser,
  getAllUsers,
};

// route matching - controller - service - model - DB
