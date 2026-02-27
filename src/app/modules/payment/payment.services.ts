/* eslint-disable @typescript-eslint/no-explicit-any */
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";

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
      {   runValidators: true, session },
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
  successPayment,
  failPayment,
  cancelPayment,
};
