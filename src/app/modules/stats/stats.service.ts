/* eslint-disable @typescript-eslint/no-explicit-any */
import { Booking } from "../booking/booking.model";
import { Payment } from "../payment/payment.model";
import { Tour } from "../tour/tour.model";
import { IsActive } from "../user/user.interface";
import { User } from "../user/user.model";

const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);

const getUserStats = async () => {
  const totalUsersPromice = User.countDocuments();
  const totalActiveUsersPromice = User.countDocuments({
    isActive: IsActive.ACTIVE,
  });

  const totalInActiveUsersPromice = User.countDocuments({
    isActive: IsActive.INACTIVE,
  });
  const totalBlockedUsersPromice = User.countDocuments({
    isActive: IsActive.BLOCKED,
  });

  const newUserInLast7DaysPromise = User.countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  });

  const newUserInLast30DaysPromise = User.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });

  const userByRolePromise = User.aggregate([
    // stage-1: grouping user by role and count total user by each role
    {
      $group: {
        _id: "$role",
        count: { $sum: 1 },
      },
    },
  ]);

  const [
    totalUsers,
    totalActiveUsers,
    totalInActiveUsers,
    totalBlockedUsers,
    newUserInLast7Days,
    newUserInLast30Days,
    userByRole,
  ] = await Promise.all([
    totalUsersPromice,
    totalActiveUsersPromice,
    totalInActiveUsersPromice,
    totalBlockedUsersPromice,
    newUserInLast7DaysPromise,
    newUserInLast30DaysPromise,
    userByRolePromise,
  ]);

  return {
    totalUsers,
    totalActiveUsers,
    totalInActiveUsers,
    totalBlockedUsers,
    newUserInLast7Days,
    newUserInLast30Days,
    userByRole,
  };
};

const getTourStats = async () => {
  const totalTourPromise = Tour.countDocuments();

  const totalTourByTourTypePromise = Tour.aggregate([
    // stage-1 : connect Tour Type model - lookup stage
    {
      $lookup: {
        from: "tourtypes",
        localField: "tourType",
        foreignField: "_id",
        as: "type",
      },
    },
    //stage - 2 : unwind the array to object

    {
      $unwind: "$type",
    },

    //stage - 3 : grouping tour type
    {
      $group: {
        _id: "$type.name",
        count: { $sum: 1 },
      },
    },
  ]);

  const avgTourCostPromise = Tour.aggregate([
    {
      $group: {
        _id: null,
        avgCostFrom: { $avg: "$costFrom" },
      },
    },
  ]);

  const totalTourByDivisionPromise = Tour.aggregate([
    // stage-1 : connect Division model - lookup stage
    {
      $lookup: {
        from: "divisions",
        localField: "division",
        foreignField: "_id",
        as: "division",
      },
    },
    //stage - 2 : unwind the array to object

    {
      $unwind: "$division",
    },

    //stage - 3 : grouping tour type
    {
      $group: {
        _id: "$division.name",
        count: { $sum: 1 },
      },
    },
  ]);

  const totalHighestBookedTourPromise = Booking.aggregate([
    // stage-1: group the tour
    {
      $group: {
        _id: "$tour",
        bookingCount: { $sum: 1 },
      },
    },

    // stage-2: sort the tours high to low
    {
      $sort: { bookingCount: -1 },
    },

    // stage-3: limit tours

    {
      $limit: 5,
    },

    // stage-4: lookup
    {
      $lookup: {
        from: "tours",
        let: { tourId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$tourId"] },
            },
          },
        ],
        as: "tour",
      },
    },
    // stage-5: lookup stage
    {
      $unwind: "$tour",
    },
    // stage-6: projects stage
    {
      $project: {
        bookingCount: 1,
        "tour.title": 1,
        "tour.slug": 1,
        "tour.costFrom": 1,
        "tour.maxGuest": 1,
      },
    },
  ]);

  const [
    totalTour,
    totalTourByTourType,
    avgTourCost,
    totalTourByDivision,
    totalHighestBookedTour,
  ] = await Promise.all([
    totalTourPromise,
    totalTourByTourTypePromise,
    avgTourCostPromise,
    totalTourByDivisionPromise,
    totalHighestBookedTourPromise,
  ]);

  return {
    totalTour,
    totalTourByTourType,
    avgTourCost,
    totalTourByDivision,
    totalHighestBookedTour,
  };
};

const getBookingStats = async () => {
  const totalBookingPromise = Booking.countDocuments();

  const totalBookingByStatusPromise = Booking.aggregate([
    // group-1 group stage
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const bookingPerTourPromise = Booking.aggregate([
    {
      // stage-1 group with tour
      $group: {
        _id: "$tour",
        bookingCount: { $sum: 1 },
      },
    },
    {
      // stage-2 sorting decending order
      $sort: { bookingCount: -1 },
    },
    {
      // stage-3: limit
      $limit: 10,
    },
    {
      $lookup: {
        from: "tours",
        localField: "_id",
        foreignField: "_id",
        as: "tour",
      },
    },
    {
      // stage-4: unwind stage
      $unwind: "$tour",
    },
    {
      // stage-4: project state
      $project: {
        bookingCount: 1,
        "tour.title": 1,
        "tour.slug": 1,
        "tour.costFrom": 1,
        "tour.include": 1,
      },
    },
  ]);

  const avgGuestsPerBookingPromise = Booking.aggregate([
    // 1  - grouping
    {
      $group: {
        _id: null,
        avgGuestCount: { $avg: "$guestCount" },
      },
    },
  ]);

  const bookingLast7DaysAgoPromise = Booking.countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  });
  const bookingLast30DaysAgoPromise = Booking.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });

  const totalBookingsByUniqueUsersPromise = Booking.distinct("user").then(
    (user: any) => user.length,
  );

  const [
    totalBooking,
    totalBookingByStatus,
    bookingPerTour,
    avgGuestsPerBooking,
    bookingLast7DaysAgo,
    bookingLast30DaysAgo,
    totalBookingsByUniqueUsers,
  ] = await Promise.all([
    totalBookingPromise,
    totalBookingByStatusPromise,
    bookingPerTourPromise,
    avgGuestsPerBookingPromise,
    bookingLast7DaysAgoPromise,
    bookingLast30DaysAgoPromise,
    totalBookingsByUniqueUsersPromise,
  ]);

  return {
    totalBooking,
    totalBookingByStatus,
    bookingPerTour,
    avgGuestsPerBooking: avgGuestsPerBooking[0].avgGuestCount,
    bookingLast7DaysAgo,
    bookingLast30DaysAgo,
    totalBookingsByUniqueUsers,
  };
};

const getPaymentStats = async () => {

  const totalPaymentsPromise = Payment.countDocuments();

  const totalPaymentsByStatusPromise = Payment.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const totalRevenuePromise = Payment.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$amount" },
      },
    },
  ]);

  const avgPaymentAmountPromise = Payment.aggregate([
    {
      $group: {
        _id: null,
        avgPaymentAmount: { $avg: "$amount" },
      },
    },
  ]);

  const paymentGateWayDataPromise = Payment.aggregate([
    {
      $group: {
        _id: {$ifNull:["$paymentGatewayData.status", "UNKNOWN"]},
        count: { $sum: 1 },
      },
    },
  ]);

  const [totalPayments, totalPaymentsByStatus, totalRevenue, avgPaymentAmount, paymentGateWayData] =
    await Promise.all([
      totalPaymentsPromise,
      totalPaymentsByStatusPromise,
      totalRevenuePromise,
      avgPaymentAmountPromise,
      paymentGateWayDataPromise,
    ]);

  return {
    totalPayments,
    totalPaymentsByStatus,
    totalRevenue ,
    avgPaymentAmount ,
    paymentGateWayData ,
  };
};

export const StatsService = {
  getUserStats,
  getBookingStats,
  getPaymentStats,
  getTourStats,
};
