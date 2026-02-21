/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import { envVars } from "../../config/env";
import { catchAsync } from "../../utils/catchAsync";
import { paymentService } from "./payment.services";


const successPayment =catchAsync( async (req:Request, res:Response) => {

  const query = req.query;
  const result = await paymentService.successPayment(query as Record<string, string>);

  console.log(result, "hit from payment controllers");
  if(result.success){
    res.redirect(envVars.SSL.SSL_SUCCESS_FRONTEND_URL)
  }

})

const failPayment = () => {

  return {}
}

const cancelPayment = () => {

  return {}
}

export const paymentControllers = {
  successPayment,
  failPayment,
  cancelPayment
}

