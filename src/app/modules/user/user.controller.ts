/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
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
  },
);

// create user using CatchAsync
const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // userId
    const userId = req.params.id;

    const payload = req.body;

    // payload
    // decodedToken
    const verifiedToken = req.user as JwtPayload;

    const user = await UserServices.updateUser(userId, payload, verifiedToken);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Succcessfully Updated a user!!",
      data: user,
    });
  },
);

// getAllUser
const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query as Record<string, string>;

    const result = await UserServices.getAllUsers(
      query as Record<string, string>,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "All user retrived successfully!",
      data: result.data,
      meta: result.meta,
    });
  },
);

const getMe = catchAsync( async (req: Request, res: Response, next: NextFunction) => {
   
    const decodedToken = req.user as JwtPayload;
    const result = await UserServices.getMe(decodedToken.userId);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Your Profile retrived successfully!",
      data: result.data
    });
  },
);

// getAllUser
const getSingleUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const result = await UserServices.getSingleUser(id);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Get a user successfully!",
      data: result.data,
    });
  },
);

export const UserControllers = {
  createUser,
  updateUser,
  getAllUsers,
  getMe,
  getSingleUser,
};

// route matching - controller - service - model - DB
