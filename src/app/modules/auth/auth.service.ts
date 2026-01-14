/* eslint-disable @typescript-eslint/no-unused-vars */
import bcryptjs from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { envVars } from "../../config/env";
import AppError from "../../errorHanlers/AppError";
import { generateToken } from "../../utils/jwt";
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


  const accessToken = generateToken(jwtPayload,envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES);
  const refreshToken = generateToken(jwtPayload,envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES);

  // delete password from user   
  const { password: _password, ...rest } = isUserExist.toObject();
  // delete isUserExist.password;

  return {
    accessToken,
    refreshToken,
    user:rest
  };
};

export const AuthServices = {
  credentialsLogin,
};
