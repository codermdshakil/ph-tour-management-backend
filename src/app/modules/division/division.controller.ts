/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { DivisionServices } from "./division.service";

const createDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    const division = await DivisionServices.createDivision(req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message:"Successfully created a Division!!",
      data: division,
    });
  },
);

export const DivisionControllers = {
  createDivision,
};
