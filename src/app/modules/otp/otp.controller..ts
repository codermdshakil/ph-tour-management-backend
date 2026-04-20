import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { OTPService } from "./otp.service";

const sentOTP = catchAsync(async (req: Request, res: Response) => {

  const userInfo = req.user as JwtPayload;
  const user = await User.findById(userInfo.userId) as IUser;
  
  await OTPService.sentOTP(user?.email, user?.name);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "OTP sent successfully!",
    data: null,
  });
});

const verifyOTP = catchAsync(async (req: Request, res: Response) => {
  // const result = await GuideServices.getSingleApplication(applicationId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "OTP Verified successfully!",
    data: null,
  });
});
 

export const OTPController = {
  sentOTP,
  verifyOTP

}