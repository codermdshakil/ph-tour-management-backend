import bcryptjs from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import AppError from "../../errorHanlers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  // check user exist or not
  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User Not Found!");
  }

  const isPasswordMatched = await bcryptjs.compare(
    password as string,
    isUserExist.password as string
  );

  if (!isPasswordMatched) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Incurrect Password!");
  }

  // const { password: _password, ...rest } = isUserExist.toObject();

  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const accessToken = jwt.sign(jwtPayload, "secret", { expiresIn: "1d" });

  return {
    accessToken,
  };
};

export const AuthServices = {
  credentialsLogin,
};
