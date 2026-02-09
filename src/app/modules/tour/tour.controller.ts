import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { TourServices } from "./tour.services";

const createTour = catchAsync(async (req: Request, res: Response) => {
  const tour = await TourServices.createTour(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Successfully created a Tour!",
    data: tour,
  });
});

const getAllTours = catchAsync(async (req: Request, res: Response) => {
  const result = await TourServices.getAllTours();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Successfully  get AllTours!",
    data: result.data,
    meta: result.meta,
  });
});

const getSingleTour = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const tour = await TourServices.getSingleTour(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Successfully get a Tour!",
    data: tour,
  });
});

const updateTour = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const tour = await TourServices.updateTour(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Successfully Updated a Tour!",
    data: tour,
  });
});

const deleteTour = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const tour = await TourServices.deleteTour(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Successfully Delete a Tour!",
    data: tour,
  });
});

export const TourControllers = {
  createTour,
  getAllTours,
  getSingleTour,
  updateTour,
  deleteTour
};
