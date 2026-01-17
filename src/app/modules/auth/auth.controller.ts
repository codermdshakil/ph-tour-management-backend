/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";


// create user and get access and refresh token
const credentialsLogin =  catchAsync( async (req: Request, res: Response, next: NextFunction) => {

  const loginInfo = await AuthServices.credentialsLogin(req.body)

    sendResponse(res, {
      success:true,
      statusCode:StatusCodes.OK,
      message:"Succcessfully user Logged In!!",
      data:loginInfo
    })
  }

);

// using refresh-token get new accessToken
const getNewAccessToken =  catchAsync( async (req: Request, res: Response, next: NextFunction) => {

  // from cookie get refreshToken
  const refreshToken = req.headers.authorization as string;

  const tokenInfo = await AuthServices.getNewAccessToken(refreshToken);

    sendResponse(res, {
      success:true,
      statusCode:StatusCodes.OK,
      message:"Succcessfully get AccessToken!!",
      data:tokenInfo
    })
  }

);

export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken
}