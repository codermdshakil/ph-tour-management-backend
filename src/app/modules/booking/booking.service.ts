/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHanlers/AppError";
import { getTransactionId } from "../../utils/getTransactionId";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { Tour } from "../tour/tour.model";
import { User } from "../user/user.model";
import { bookingSearchAbleFields } from "./booking.constant";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import { Booking } from "./booking.model";



// SSLcommerz implementation

// Frontend(localhost:5173) -> user -> Booking(Pending) -> Payment(Unpaid) -> SSLcommerz page -> Payment Complete -> Backend(localhost:5000) -> updating  Booking(Completed) & Payment(Paid) ->  redireact to -> Frontend -> frontend(localhost:5173/payment/success);

// Frontend(localhost:5173) -> user -> user -> Booking(Pending) -> Payment(Unpaid) -> SSLcommerz page -> Payment Complete -> Backend(localhost:5000) -> updating  Booking(Fail/Cancel) & Payment(Fail/Cancel) ->  redireact to -> Frontend -> frontend(localhost:5173/payment/fail or localhost:5173/payment/cancel );

// create booking
const createBooking = async (payload: Partial<IBooking>, userId: string) => {
  const transactionId = getTransactionId();

  // Implment transaction and Rollback for Booking, Payment;
  // 1. create session
  // 2. try-catch block try block a sob operations
  // 3. [Create / Update] er somoy - operations Booking.create([{bookingPayload}], {session}) er second parameter hisabe session add koro
  // 4. session commit kora lagbe
  //    - await session.commitTransaction();
  //    - session.endSession();

  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId);

    if (!user?.phone || !user?.address) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Pleaes, Update your Profile including Phone and Address to book a Tour!",
      );
    }

    const tour = await Tour.findById(payload.tour).select("costFrom");

    if (!tour?.costFrom) {
      throw new AppError(StatusCodes.BAD_REQUEST, "No not tour costFrom");
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const amount = Number(tour.costFrom) * Number(payload.guestCount!);

    const booking = await Booking.create(
      [
        {
          user: userId,
          status: BOOKING_STATUS.PENDING,
          ...payload,
        },
      ],
      { session },
    );

    const payment = await Payment.create(
      [
        {
          booking: booking[0]._id,
          status: PAYMENT_STATUS.UNPAID,
          transactionId: transactionId,
          amount: amount,
        },
      ],
      { session },
    );

    const updatedBooking = await Booking.findByIdAndUpdate(
      booking[0]._id,
      { payment: payment[0]._id },
      { new: true, runValidators: true, session },
    )
      .populate("user", "name email phone address")
      .populate("tour", "title costFrom")
      .populate("payment");

    const userAddress = (updatedBooking?.user as any).address;
    const userEmail = (updatedBooking?.user as any).email;
    const userPhoneNumber = (updatedBooking?.user as any).phone;
    const userName = (updatedBooking?.user as any).name;

    const sslPayload: ISSLCommerz = {
      address: userAddress,
      email: userEmail,
      phoneNumber: userPhoneNumber,
      name: userName,
      amount: amount,
      transactionId: transactionId,
    };

    const sslPayment = await SSLService.sslPaymentInit(sslPayload);

    await session.commitTransaction(); //transaction
    session.endSession();
    return {
      paymentUrl: sslPayment.GatewayPageURL,
      booking: updatedBooking,
    };
  } catch (error: any) {
    // ai khane jodi whole process a kono error hoy sob kisu bad diye dibe
    await session.abortTransaction(); // rollback
    session.endSession();
    throw error;
  }
};

const getSingleBooking = async (bookingId: string) => {
  const result = await Booking.findByIdAndDelete(bookingId);

  if (!result) {
    throw new Error("Booking not found");
  }

  return result;
};

const getAllBookings = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Booking.find(), query);

  const booking = await queryBuilder
    .search(bookingSearchAbleFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  // const meta = await queryBuilder.getMeta()

  const [data, meta] = await Promise.all([booking.build(), booking.getMeta()]);

  return {
    data,
    meta,
  };
};

const getUserBookings = async (userId: string) => {
  const bookings = await Booking.find({ user: userId })
    .populate("tour")
    .populate("payment");

  return bookings;
};

const updateBookingStatus = async (
  bookingId: string,
  payload: Partial<IBooking>,
) => {
  const booking = await Booking.findByIdAndUpdate(bookingId, payload, {
    new: true, // return updated document
    runValidators: true,
  });

  if (!booking) {
    throw new AppError(StatusCodes.NOT_FOUND, "Booking not found");
  }

  return booking;
};

export const BookingService = {
  createBooking,
  getSingleBooking,
  getAllBookings,
  updateBookingStatus,
  getUserBookings,
};
