import { Booking } from "../booking/booking.model";
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
        count:{$sum:1}
      },
    },
  ]);

  const booking


  const [totalBooking, totalBookingByStatus] = await Promise.all([
    totalBookingPromise,
    totalBookingByStatusPromise,
  ]);

  return { totalBooking, totalBookingByStatus };

};



const getPaymentStats = async () => {
  return {};
};

export const StatsService = {
  getUserStats,
  getBookingStats,
  getPaymentStats,
  getTourStats,
};
