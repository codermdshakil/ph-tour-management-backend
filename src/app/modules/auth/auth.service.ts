/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import bcryptjs from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHanlers/AppError";
import {
  createAccessTokenWithRefreshToken,
  createUserTokens,
} from "../../utils/userTokens";
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
    isUserExist.password as string,
  );

  if (!isPasswordMatched) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Incurrect Password!");
  }



  const userTokens = createUserTokens(isUserExist);

  // delete password from user
  const { password: _password, ...rest } = isUserExist.toObject();
  // delete isUserExist.password;

  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: rest,
  };
};

// using refreshToken get new AccessToken
const getNewAccessToken = async (refreshToken: string) => {
  const accessToken =  await createAccessTokenWithRefreshToken(refreshToken);
  return  {accessToken};
};


const resetPassword = async (oldPassword:string, newPassword:string, decodedToken:JwtPayload) => {

  const user = await User.findById(decodedToken.userId);

  const isOldPasswordMatched = bcryptjs.compare(oldPassword, user!.password as string);

  if(!isOldPasswordMatched){
    throw new AppError(StatusCodes.UNAUTHORIZED,"Old password doen't Matched");
  };

  const newHashedPassword = await bcryptjs.hash(newPassword, Number(envVars.BCRYPTJS_SALT_ROUND));


  // update user with new password
  user!.password= newHashedPassword;

  // save user
  user?.save();
}
 
export const AuthServices = {
  credentialsLogin,
  getNewAccessToken,
  resetPassword
};
