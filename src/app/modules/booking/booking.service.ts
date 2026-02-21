/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHanlers/AppError";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { Tour } from "../tour/tour.model";
import { User } from "../user/user.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import { Booking } from "./booking.model";

const getTransactionId = () => {
  return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

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
        "Pleaes, Update your Profile to book a Tour!",
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

    const updateBooking = await Booking.findByIdAndUpdate(
      booking[0]._id,
      { payment: payment[0]._id },
      { new: true, runValidators: true, session },
    )
      .populate("user", "name email password role")
      .populate("tour", "title costFrom")
      .populate("payment");

    await session.commitTransaction(); // transaction
    session.endSession();

    return updateBooking;
  } catch (error:any) {
    // ai khane jodi whole process a kono error hoy sob kisu bad diye dibe
    await session.abortTransaction(); // rollback
    session.endSession();
    throw error;
  }
};

const updateBookingStatus = () => {};

const deleteBooking = () => {};

const getSingleBooking = () => {};
const getAllBookings = () => {};

const getUserBookings = () => {};

export const BookingService = {
  createBooking,
  updateBookingStatus,
  deleteBooking,
  getAllBookings,
  getSingleBooking,
  getUserBookings,
};
