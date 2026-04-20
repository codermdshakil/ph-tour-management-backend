import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { OTPService } from "./otp.service";

const sentOTP = catchAsync(async (req: Request, res: Response) => {

  const {email, name} = req.body;
  
  await OTPService.sentOTP(email, name);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "OTP sent successfully!",
    data: null,
  });
});

const verifyOTP = catchAsync(async (req: Request, res: Response) => {
  
  const {email, otp} = req.body;

  await OTPService.verifyOTP(email, otp);

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