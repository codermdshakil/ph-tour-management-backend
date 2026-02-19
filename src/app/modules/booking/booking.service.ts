/* eslint-disable @typescript-eslint/no-unused-vars */
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

  const user = await User.findById(userId);

  // if(!user?.phone || !user?.address){
  //   throw new AppError(StatusCodes.BAD_REQUEST, "Pleaes, Update your Profile to book a Tour!");
  // };

  const tour = await Tour.findById(payload.tour).select("costFrom");

  if (!tour?.costFrom) {
    throw new AppError(StatusCodes.BAD_REQUEST, "No not tour costFrom");
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const amount = Number(tour.costFrom) * Number(payload.guestCount!);

  const booking = await Booking.create({
    user: userId,
    status: BOOKING_STATUS.PENDING,
    ...payload,
  });

  const payment = await Payment.create({
    booking: booking._id,
    status: PAYMENT_STATUS.UNPAID,
    transactionId: transactionId,
    amount: amount,
  });

  const updateBooking = await Booking.findByIdAndUpdate(
    booking._id,
    { payment: payment._id },
    { new: true, runValidators: true },
  )
    .populate("user", "name email password role")
    .populate("tour", "title costFrom")
    .populate("payment");

  return updateBooking;
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
