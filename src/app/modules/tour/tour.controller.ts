import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { TourServices } from "./tour.services";


// ------ TourType Starts here ---- 

const createTourType = catchAsync(async (req: Request, res: Response) => {
  const tourType = await TourServices.createTourType(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Successfully created a TourType!",
    data: tourType,
  });
});

const updateTourType = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await TourServices.updateTourType(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Successfully Updated a TourType!",
    data: result,
  });
});

const getAllTourType = catchAsync(async (req: Request, res: Response) => {
 
  const result = await TourServices.getAllTourType();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Successfully get All TourType!",
    data: result,
  });
});

const deleteTourType = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await TourServices.deleteTourType(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Successfully Delete a TourType!",
    data: result,
  });
});


// Tours Controllers starts here 

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

  const query = req.query as Record<string, string>;

  const result = await TourServices.getAllTours(query as Record<string, string>);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Successfully  get AllTours!",
    data: result.data,
    // meta: result.meta,
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
  createTourType,
  updateTourType, 
  getAllTourType,
  deleteTourType,
  createTour,
  getAllTours,
  getSingleTour,
  updateTour,
  deleteTour
};
