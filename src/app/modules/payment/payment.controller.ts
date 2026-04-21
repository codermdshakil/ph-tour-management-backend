import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { envVars } from "../../config/env";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paymentService } from "./payment.services";

const initPayment = catchAsync(async (req: Request, res: Response) => {

  const bookingId = req.params.bookingId;
  const result = await paymentService.initPayment(bookingId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Successfully Payment done!!",
    data: result,
  });

});

const successPayment = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await paymentService.successPayment(
    query as Record<string, string>,
  );

  if (result.success) {
    res.redirect(
      `${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`,
    );
  }
});

const failPayment = async (req: Request, res: Response) => {
  const query = req.query;
  const result = await paymentService.failPayment(
    query as Record<string, string>,
  );

  if (!result.success) {
    res.redirect(
      `${envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`,
    );
  }
};

const cancelPayment = async (req: Request, res: Response) => {
  const query = req.query;
  const result = await paymentService.cancelPayment(
    query as Record<string, string>,
  );

  if (!result.success) {
    res.redirect(
      `${envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`,
    );
  }
};


const getInvoiceDownloadUrl =  catchAsync(async (req:Request, res:Response) => {

  const paymentId = req.params.paymentId;
  const result = await paymentService.getInvoiceDownloadUrl(paymentId)

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Successfully get Payment download URL !!",
    data: result,
  });

})

export const paymentControllers = {
  initPayment,
  successPayment,
  failPayment,
  cancelPayment,
  getInvoiceDownloadUrl
};
