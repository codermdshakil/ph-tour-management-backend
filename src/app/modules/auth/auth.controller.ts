/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHanlers/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { clearCookie, setAuthCookie } from "../../utils/setCookie";
import { AuthServices } from "./auth.service";

// create user and get access and refresh token
const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthServices.credentialsLogin(req.body);

    // set accessToken, refreshToken to cookies
    setAuthCookie(res, loginInfo);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Succcessfully user Logged In!!",
      data: loginInfo,
    });
  },
);

// using refresh-token get new accessToken
const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // from cookies get refreshToken
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "No refreshToken recived from cookies!",
      );
    }

    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken);

    // set updated accessToken  to cookies
    setAuthCookie(res, tokenInfo);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Succcessfully get AccessToken!!",
      data: tokenInfo,
    });
  },
);

const logout = catchAsync( async (req: Request, res: Response, next: NextFunction) => {
    // clear accessToken and refreshToken from cookie
    clearCookie(res);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "User Logout Succcessfully!!",
    });
  },
);

export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
  logout,
};
