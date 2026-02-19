import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { BookingService } from "./booking.service";


const createBooking = catchAsync( async (req:Request, res:Response ) => {

    const decodedToken = req.user as JwtPayload;

    const booking = await BookingService.createBooking(req.body, decodedToken.userId);

    sendResponse(res, {
        success:true,
        statusCode:StatusCodes.CREATED,
        message:"Successfully created a Booking!",
        data:booking
    });

});


const updateBookingStatus = catchAsync( async (req:Request, res:Response ) => {

    // const division = await DivisionService.createDivision(req.body);

    sendResponse(res, {
        success:true,
        statusCode:StatusCodes.CREATED,
        message:"Successfully created a Division!",
        data:division
    });

});
const getSingleBooking = catchAsync( async (req:Request, res:Response ) => {

    // const division = await DivisionService.createDivision(req.body);

    sendResponse(res, {
        success:true,
        statusCode:StatusCodes.CREATED,
        message:"Successfully created a Division!",
        data:division
    });

});
const deleteBooking = catchAsync( async (req:Request, res:Response ) => {

    // const division = await DivisionService.createDivision(req.body);

    sendResponse(res, {
        success:true,
        statusCode:StatusCodes.CREATED,
        message:"Successfully created a Division!",
        data:division
    });

});
const getAllBookings = catchAsync( async (req:Request, res:Response ) => {

    // const division = await DivisionService.createDivision(req.body);

    sendResponse(res, {
        success:true,
        statusCode:StatusCodes.CREATED,
        message:"Successfully created a Division!",
        data:division
    });

});

const getUserBookings = catchAsync( async (req:Request, res:Response ) => {

    // const division = await DivisionService.createDivision(req.body);

    sendResponse(res, {
        success:true,
        statusCode:StatusCodes.CREATED,
        message:"Successfully created a Division!",
        data:division
    });

});




export const BookingController = {
createBooking, 
updateBookingStatus,
deleteBooking,
getUserBookings,
getSingleBooking,
getAllBookings
}

