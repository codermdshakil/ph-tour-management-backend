import { Request, Response } from "express";
import { envVars } from "../../config/env";
import { catchAsync } from "../../utils/catchAsync";
import { paymentService } from "./payment.services";




const successPayment = catchAsync(async (req: Request, res: Response) => {

  const query = req.query;
  const result = await paymentService.successPayment(query as Record<string, string>);


  if (result.success) { 
    res.redirect(`${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`);
  }

});

const failPayment = async (req: Request, res: Response) => {


  const query = req.query;
  const result = await paymentService.failPayment(query as Record<string, string>);

  if (!result.success) {
    res.redirect(
      `${envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`);
  }

};

const cancelPayment = async (req: Request, res: Response) => {


  const query = req.query;
  const result = await paymentService.cancelPayment(query as Record<string, string>);

  if (!result.success) { 
     res.redirect( `${envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`);
  }
  
};

export const paymentControllers = {
  successPayment,
  failPayment,
  cancelPayment,
};
