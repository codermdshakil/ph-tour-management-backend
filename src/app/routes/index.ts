import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { DivisionRoutes } from "../modules/division/division.routes";
import { TourRoutes } from "../modules/tour/tour.route";
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
    route:TourRoutes
  },
   
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
})