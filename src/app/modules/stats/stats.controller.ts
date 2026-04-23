import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatsService } from "./stats.service";


const getUserStats = catchAsync(async (req: Request, res: Response) => {
    const stats = await StatsService.getUserStats();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User stats fetched successfully",
        data: stats,
    });
});

const getTourStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await StatsService.getTourStats();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User tours fetched successfully",
        data: stats,
    });
});

const getBookingStats = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as Record<string, string>;

  const result = await StatsService.getBookingStats(query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Booking statistics retrieved successfully",
    // data: result.data,
    // meta: result.meta,
  });
});

const getPaymentStats = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as Record<string, string>;

  const result = await StatsService.getBookingStats(query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Booking statistics retrieved successfully",
    // data: result.data,
    // meta: result.meta,
  });
});



export const StatsController = {
  getUserStats,
  getBookingStats,
  getPaymentStats,
  getTourStats
};
