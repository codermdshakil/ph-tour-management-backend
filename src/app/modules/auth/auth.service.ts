/* eslint-disable @typescript-eslint/no-unused-vars */
import bcryptjs from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHanlers/AppError";
import { generateToken, verifyToken } from "../../utils/jwt";
import { createUserTokens } from "../../utils/userTokens";
import { IsActive, IUser } from "../user/user.interface";
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

  // const jwtPayload = {
  //   userId: isUserExist._id,
  //   email: isUserExist.email,
  //   role: isUserExist.role,
  // };

  // const accessToken = generateToken(jwtPayload,envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES);
  // const refreshToken = generateToken(jwtPayload,envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES);

  const userTokens = createUserTokens(isUserExist);

  // delete password from user   
  const { password: _password, ...rest } = isUserExist.toObject();
  // delete isUserExist.password;

  return {
    accessToken:userTokens.accessToken,
    refreshToken:userTokens.refreshToken,
    user:rest
  };
};

// using refreshToken get new AccessToken
const getNewAccessToken = async (refreshToken:string) => {

  // 1. verify refreshtoken
  const verifiedRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload;
  
  // 2. check isUserExit?

  const isUserExist = await User.findOne({email:verifiedRefreshToken.email});

  if(!isUserExist){
    throw new AppError(StatusCodes.BAD_REQUEST, "User not Found!!")
  }

  if(isUserExist.isActive ===  IsActive.BLOCKED || isUserExist.isActive ===  IsActive.INACTIVE){
    throw new AppError(StatusCodes.BAD_REQUEST, `User is ${isUserExist.isActive}!!`)
  }

  if(isUserExist.isDeleted){
    throw new AppError(StatusCodes.BAD_REQUEST, "User is Deleted!!")
  }


  // now generate new accessToken

  const jwtPayload = {
    userId:isUserExist._id,
    email:isUserExist.email,
    role:isUserExist.role
  };

  const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET,envVars.JWT_ACCESS_EXPIRES);

  return {
    accessToken:accessToken
  }
}

export const AuthServices = {
  credentialsLogin,
  getNewAccessToken
};
