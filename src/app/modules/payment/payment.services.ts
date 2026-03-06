/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHanlers/AppError";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { User } from "../user/user.model";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";

const initPayment = async (bookingId: string) => {
  const resultPayment = await Payment.findOne({ booking: bookingId });

  if (!resultPayment) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Payment not found! You have not take this tour!",
    );
  }

  const booking = await Booking.findById(bookingId);
  const user = await User.findById(booking?.user);
  const payment = await Payment.findById(booking?.payment);

  const userAddress = (user as any).address;
  const userEmail = (user as any).email;
  const userPhoneNumber = (user as any).phone;
  const userName = (user as any).name;
  const userAmount = payment?.amount as number;
  const userTransactionId = payment?.transactionId as string;

  const sslPayload: ISSLCommerz = {
    address: userAddress,
    email: userEmail,
    phoneNumber: userPhoneNumber,
    name: userName,
    amount: userAmount,
    transactionId: userTransactionId,
  };

  const sslPayment = await SSLService.sslPaymentInit(sslPayload);

  return {
    paymentUrl: sslPayment.GatewayPageURL,
  };

  
};

const successPayment = async (query: Record<string, string>) => {
  // update booking status to Comfirm
  // update payment status to PAID

  //  jehato 2 ta module tai transaction & rollback

  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.PAID },
      { session },
    );

    await Booking.findOneAndUpdate(
      updatedPayment?.booking,
      { status: BOOKING_STATUS.COMPLETE },
      { runValidators: true, session },
    );

    await session.commitTransaction(); //transaction
    session.endSession();

    return { success: true, message: "Payment Completed SuccessFully" };
  } catch (error: any) {
    // ai khane jodi whole process a kono error hoy sob kisu bad diye dibe
    await session.abortTransaction(); // rollback
    session.endSession();
    throw error;
  }
};

const failPayment = async (query: Record<string, string>) => {
  // update booking status to fail
  // update payment status to fail

  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.FAILED },
      { session },
    );

    await Booking.findOneAndUpdate(
      updatedPayment?.booking,
      { status: BOOKING_STATUS.FAILED },
      { runValidators: true, session },
    );

    await session.commitTransaction(); //transaction
    session.endSession();

    return { success: false, message: "Payment Failed!" };
  } catch (error: any) {
    // ai khane jodi whole process a kono error hoy sob kisu bad diye dibe
    await session.abortTransaction(); // rollback
    session.endSession();
    throw error;
  }
};

const cancelPayment = async (query: Record<string, string>) => {
  // update booking status to cancel
  // update payment status to cancel

  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.CANCELLED },
      { session },
    );

    await Booking.findOneAndUpdate(
      updatedPayment?.booking,
      { status: BOOKING_STATUS.CANCEL },
      { runValidators: true, session },
    );

    await session.commitTransaction(); //transaction
    session.endSession();

    return { success: false, message: "Payment Cancel!" };
  } catch (error: any) {
    // ai khane jodi whole process a kono error hoy sob kisu bad diye dibe
    await session.abortTransaction(); // rollback
    session.endSession();
    throw error;
  }
};

export const paymentService = {
  initPayment,
  successPayment,
  failPayment,
  cancelPayment,
};
