import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { BookingService } from "./booking.service";

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;

  const booking = await BookingService.createBooking(
    req.body,
    decodedToken.userId,
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Successfully created a Booking!",
    data: booking,
  });
});

const getSingleBooking = catchAsync(async (req: Request, res: Response) => {
  const bookingId = req.params.bookingId;
  const result = await BookingService.getSingleBooking(bookingId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Successfully Delete a Booking!",
    data: result,
  });
});

const getAllBookings = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as Record<string, string>;

  const result = await BookingService.getAllBookings(
    query as Record<string, string>,
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Successfully created a Division!",
    data: result.data,
    meta: result.meta,
  });
});

const getUserBookings = catchAsync(async (req: Request, res: Response) => {

  const user = req.user as JwtPayload;
  const result = await BookingService.getUserBookings(user.userId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Successfully get user Bookings",
    data: result,
  });
});

const updateBookingStatus = catchAsync(async (req: Request, res: Response) => {

  const bookingId = req.params.bookingId;

  const result = await BookingService.updateBookingStatus(bookingId, req.body);


  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Successfully Update a Booking!",
    data: result,
  });
});



export const BookingController = {
  createBooking,
  updateBookingStatus,
  getUserBookings,
  getSingleBooking,
  getAllBookings,
};
