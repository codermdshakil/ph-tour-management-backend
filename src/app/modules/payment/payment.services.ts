/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from "http-status-codes";
import { uploadBufferToCloudinary } from "../../config/cloudinary.config";
import AppError from "../../errorHanlers/AppError";
import { generatePdf, IInvoiceData } from "../../utils/generateInvoice";
import { sendEmail } from "../../utils/sendEmail";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { ITour } from "../tour/tour.interface";
import { IUser } from "../user/user.interface";
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

    const updatedBooking = await Booking.findOneAndUpdate(
      updatedPayment?.booking,
      { status: BOOKING_STATUS.COMPLETE },
      { new: true, runValidators: true, session },
    )
      .populate("tour", "title")
      .populate("user", "name email");

    if (!updatedBooking) {
      throw new AppError(StatusCodes.NOT_FOUND, "Booking not Found!");
    }

    if (!updatedPayment) {
      throw new AppError(StatusCodes.NOT_FOUND, "Booking not Found!");
    }

    // Generate PDF
    const invoiceData: IInvoiceData = {
      bookingDate: updatedBooking.createdAt as Date,
      guestCount: updatedBooking.guestCount,
      transactionId: updatedPayment.transactionId,
      totalAmount: updatedPayment.amount,
      tourTitle: (updatedBooking.tour as unknown as ITour).title,
      userName: (updatedBooking.user as unknown as IUser).name,
    };

    // Generate PDF

    const pdfBuffer = await generatePdf(invoiceData);

    // invoice download URL link get from clodianry

    const cloudinaryResult = await uploadBufferToCloudinary(
      pdfBuffer,
      "invoice",
    );

    if (!cloudinaryResult) {
      throw new AppError(401, "Cloudinary Result not Found!");
    }

    await Payment.findByIdAndUpdate(
      updatedPayment._id,
      { invoiceUrl: cloudinaryResult.secure_url },
      { runValidators: true, session },
    );

    // sent email to user
    await sendEmail({
      to: (updatedBooking.user as unknown as IUser).email,
      subject: "Your Booking Invoice",
      templateName: "invoice",
      templateData: invoiceData,
      attachments: [
        {
          filename: "invoice.pdf",
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

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

const getInvoiceDownloadUrl = async (
  paymentId: string,
) => {

  const payment = await Payment.findById(paymentId).select("invoiceUrl booking -_id");

  if (!payment) {
    throw new AppError(401, "Payment not found!");
  }

  if (!payment.invoiceUrl) {
    throw new AppError(401, "Payment Invoice URL not found!");
  }

  return payment;
};

export const paymentService = {
  initPayment,
  successPayment,
  failPayment,
  cancelPayment,
  getInvoiceDownloadUrl,
};
