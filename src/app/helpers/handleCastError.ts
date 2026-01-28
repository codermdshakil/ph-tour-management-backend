/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from "mongoose";
import { TGenericErrorResponse } from "../interfaces/error.types";

  // handle mongoose cast error
 export const handleCastError = (err: mongoose.Error.CastError) : TGenericErrorResponse=> {
    // console.log(err);
    return {
      statusCode: 400,
      message: "Invalid MongoDB objectID, Please Provide a valid ObjectID",
    };
  };
