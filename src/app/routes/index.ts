import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { bookingRoutes } from "../modules/booking/booking.route";
import { DivisionRoutes } from "../modules/division/division.routes";
import { GuideRoutes } from "../modules/guide/guide.routes";
import { OTPRoutes } from "../modules/otp/otp.router";
import { PaymentRoutes } from "../modules/payment/payment.routes";
import { StatsRoutes } from "../modules/stats/stats.route";
import { TourRoutes } from "../modules/tour/tour.routes";
import { UserRoutes } from "../modules/user/user.routes";


export const router = Router();


const moduleRoutes = [
  {
    path:"/user",
    route:UserRoutes
  },
  {
    path:"/auth",
    route:AuthRoutes
  },
  {
    path:"/division",
    route:DivisionRoutes
  },
  {
    path:"/tour",
    route: TourRoutes
  },
  {
    path:"/booking",
    route: bookingRoutes
  },
  {
    path:"/payment",
    route: PaymentRoutes
  },
  {
    path:"/guide",
    route: GuideRoutes
  },
  {
    path:"/otp",
    route: OTPRoutes
  },
  {
    path:"/stats",
    route: StatsRoutes
  },
   
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
})