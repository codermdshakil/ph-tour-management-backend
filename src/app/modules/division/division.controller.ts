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


const getAllDivisions = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    const result = await DivisionServices.getAllDivisions();
    
        sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: "All Divisions retrived successfully!",
          data: result.data,
          meta: result.meta,
        });
  },
);


const updateDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    const id = req.params.id;

    const updatedDivision = await DivisionServices.updateDivision(id, req.body);
    
   
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message:"Successfully Updated a Division!!",
      data: updatedDivision,
    });

  });



 

export const DivisionControllers = {
  createDivision,
  getAllDivisions,
  updateDivision
};
