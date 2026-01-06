import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHanlers/AppError";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserControllers } from "./user.controller";
import { Role } from "./user.interface";
import { createUserZodSchema } from "./user.validate";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserControllers.createUser
);
router.get("/all-users",
  (req: Request, res: Response, next: NextFunction) => {

    try {

      // 1. get access token
      const accessToken = req.headers.authorization;

      // handle error
      if (!accessToken) {
        throw new AppError(StatusCodes.BAD_REQUEST, "No token Recived!");
      }

      // 2. get verified token
      const verifiedToken = jwt.verify(accessToken, "secret");

      console.log(verifiedToken, "verifiedToken");

      // handle error
      if (!verifiedToken) {
        throw new AppError(StatusCodes.BAD_REQUEST, "You are not Authorized!");
      }

      if((verifiedToken as JwtPayload).role !== Role.ADMIN || Role.SUPER_ADMIN){
        throw new AppError(StatusCodes.BAD_REQUEST, "You are not permitted to view this Route!")
      }
  
      next();

    } catch (error) {
      next(error)
    }

  },
  UserControllers.getAllUsers
);

export const UserRoutes = router;
