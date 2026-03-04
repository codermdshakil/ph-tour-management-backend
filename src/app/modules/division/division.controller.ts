import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { IDivision } from "./division.interface"
import { DivisionService } from "./division.service"

const createDivision = catchAsync( async (req:Request, res:Response ) => {



    // payload for create division
    const payload : IDivision = {
        ...req.body,
        thumbnail:req.file?.path
    }

    const division = await DivisionService.createDivision(payload);

    sendResponse(res, {
        success:true,
        statusCode:StatusCodes.CREATED,
        message:"Successfully created a Division!",
        data:division
    });

});

const getAllDivisions = catchAsync( async (req, res) => {
    
     const query = req.query as Record<string, string>;

    const result = await DivisionService.getAllDivisions(query as Record<string, string>);

    sendResponse(res, {
        success:true,
        statusCode:StatusCodes.CREATED,
        message:"Successfully created a Division!",
        data:result.data,
        meta:result.meta
    });
})


const updateDivision = catchAsync( async (req:Request, res:Response) => {

     // payload for create division
    const payload : IDivision = {
        ...req.body,
        thumbnail:req.file?.path
    }

    const updated = await DivisionService.updateDivision(req.params.id,payload);

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

    const slug = req.params.slug
    const result = await DivisionService.getSingleDivision(slug);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Divisions retrieved",
        data: result.data,
    });
});



export const DivisionControllers = {
    createDivision,
    getAllDivisions,
    updateDivision,
    deleteDivision,
    getSingleDivision
}
