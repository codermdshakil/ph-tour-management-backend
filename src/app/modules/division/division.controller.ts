import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { DivisionService } from "./division.service"

const createDivision = catchAsync( async (req:Request, res:Response ) => {

    const division = await DivisionService.createDivision(req.body);

    sendResponse(res, {
        success:true,
        statusCode:StatusCodes.CREATED,
        message:"Successfully created a Division!",
        data:division
    })
});


const updateDivision = catchAsync( async (req:Request, res:Response) => {

    const updated = await DivisionService.updateDivision(req.params.id, req.body);

    sendResponse(res, {
        success:true,
        statusCode:StatusCodes.OK,
        message:"Successfully Updated a Division!",
        data:updated
    })
});


const deleteDivision = catchAsync( async (req:Request, res:Response) => {

    const updated = await DivisionService.deleteDivision(req.params.id);

    sendResponse(res, {
        success:true,
        statusCode:StatusCodes.OK,
        message:"Successfully Deleted a Division!",
        data:updated
    })
});


const getSingleDivision = catchAsync( async (req:Request, res:Response) => {

    const division = await DivisionService.getSingleDivision(req.params.id);

    sendResponse(res, {
        success:true,
        statusCode:StatusCodes.OK,
        message:"Successfully get a Division!",
        data:division
    })
});



export const DivisionControllers = {
    createDivision,
    updateDivision,
    deleteDivision,
    getSingleDivision
}
