/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHanlers/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { GuideServices } from "./guide.service";

const applyForGuide = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;

  // 1. file check
  if (!req.file) {
    throw new Error("NID photo is required");
  }

  // 2. parse data safely (if using 'data' field)
  let parsedData = {};

  if (req.body?.data) {
    try {
      parsedData = JSON.parse(req.body.data);
    } catch (err: any) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Invalid JSON format in 'data'",
      );
    }
  } else {
    parsedData = req.body;
  }

  // 3. payload build
  const payload = {
    ...parsedData,
    nidPhoto: req.file.path,
  } as JwtPayload;

  const result = await GuideServices.applyForGuide(user, payload);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Guide application data received",
    data: result,
  });
});

const updateGuideApplicationStatus = catchAsync(
  async (req: Request, res: Response) => {
    const admin = req.user as JwtPayload;
    const applicationId = req.params.id;
    const { status } = req.body;

    const result = await GuideServices.updateGuideApplicationStatus(
      admin,
      applicationId,
      status,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Guide Status Updated Successfully!",
      data: result,
    });
  },
);

export const GuideControllers = {
  applyForGuide,
  updateGuideApplicationStatus,
};
