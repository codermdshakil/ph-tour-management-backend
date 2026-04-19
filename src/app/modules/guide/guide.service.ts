import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHanlers/AppError";
import { Division } from "../division/division.model";
import { Role } from "../user/user.interface";
import { User } from "../user/user.model";
import { IGuideApplication } from "./guide.interface";
import { GuideApplication } from "./guide.model";

const applyForGuide = async (user:JwtPayload, payload: JwtPayload) => {
  // user exist or role valid check

  const isUserExist = await User.findById(user.userId);

  if (!isUserExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found!");
  }

  if (isUserExist.role !== Role.USER) {
    throw new AppError(403, "Only users can apply for guide");
  }

  // Duplicate Application Check
  const existingApplication = await GuideApplication.findOne({ user: user.userId });
  if (existingApplication) {
    throw new AppError(400, "You have already applied for guide");
  }

  // Division Validation
  const division = await Division.findById(payload.divisionId);

  if (!division) {
    throw new AppError(404, "Division not found");
  }

  // NID validation
  if (!payload.nidPhoto) {
    throw new AppError(400, "NID photo is required");
  }

  const applicationData: IGuideApplication = {
    user: user.userId,
    division: payload.divisionId,
    nidPhoto: payload.nidPhoto,
    status: "PENDING",
  };

  const result = await GuideApplication.create(applicationData);


  return result;
};

export const GuideServices = {
  applyForGuide,
};
