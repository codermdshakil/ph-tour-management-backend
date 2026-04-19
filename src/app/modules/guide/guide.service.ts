import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import AppError from "../../errorHanlers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { Division } from "../division/division.model";
import { Role } from "../user/user.interface";
import { User } from "../user/user.model";
import { guideApplicationSearchAbleFields } from "./guide.constant";
import { IGuideApplication } from "./guide.interface";
import { GuideApplication } from "./guide.model";

const applyForGuide = async (user: JwtPayload, payload: JwtPayload) => {
  // user exist or role valid check

  const isUserExist = await User.findById(user.userId);

  if (!isUserExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found!");
  }

  if (isUserExist.role !== Role.USER) {
    throw new AppError(403, "Only users can apply for guide");
  }

  // Duplicate Application Check
  const existingApplication = await GuideApplication.findOne({
    user: user.userId,
  });
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


const updateGuideApplicationStatus = async (
  user: JwtPayload,
  applicationId: string,
  status: "APPROVED" | "REJECTED",
) => {
  // 1. Authorization
  if (![Role.ADMIN, Role.SUPER_ADMIN].includes(user.role)) {
    throw new AppError(403, "Unauthorized");
  }

  // 2. Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    throw new AppError(400, "Invalid application ID");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 3. Find application (WITH session)
    const application = await GuideApplication.findById(applicationId).session(session);

    if (!application) {
      throw new AppError(404, "Application not found");
    }

    // 4. State validation
    if (application.status !== "PENDING") {
      throw new AppError(400, "Application already processed");
    }

    // 5. Get user (WITH session)
    const targetUser = await User.findById(application.user).session(session);

    if (!targetUser) {
      throw new AppError(404, "Associated user not found");
    }

    // 6. Update application status
    application.status = status;
    await application.save({ session });

    // 7. Update user role (only if approved)
    if (status === "APPROVED") {
      await User.findByIdAndUpdate(
        application.user,
        { role: Role.GUIDE },
        { session },
      );
    }

    // 8. Final populated result (single query reuse)
    const updatedApplication = await GuideApplication.findById(applicationId)
      .populate("user", "-password -__v")
      .populate("division", "-__v")
      .session(session);

    await session.commitTransaction();
    return updatedApplication;

  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};


const getSingleApplication = async (applicationId: string) => {
  // 1. Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    throw new AppError(400, "Invalid application ID");
  }

  // 2. Find application by ID
  const application = await GuideApplication.findById(applicationId)
    .populate("user", "-password -__v")
    .populate("division", "-__v");

  if (!application) {
    throw new AppError(StatusCodes.NOT_FOUND, "Application not found");
  }

  return application;
};


const getAllGuides = async (query:Record<string, string>) => {

   const queryBuilder = new QueryBuilder(GuideApplication.find(), query);

 const guides = await queryBuilder
        .search(guideApplicationSearchAbleFields)
        .filter()
        .sort()
        .fields()
        .paginate()

    // const meta = await queryBuilder.getMeta()

    const [data, meta] = await Promise.all([
        guides.build(),
        guides.getMeta()
    ]);

    return {
      data,
      meta
    }
}



export const GuideServices = {
  applyForGuide,
  updateGuideApplicationStatus,
  getSingleApplication,
  getAllGuides
};
