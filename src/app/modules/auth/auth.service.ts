/* eslint-disable @typescript-eslint/no-non-null-assertion */
import bcryptjs from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHanlers/AppError";
import {
  createAccessTokenWithRefreshToken
} from "../../utils/userTokens";
import { IAuthProvider } from "../user/user.interface";
import { User } from "../user/user.model";

// const credentialsLogin = async (payload: Partial<IUser>) => {
//   const { email, password } = payload;

//   // check user exist or not
//   const isUserExist = await User.findOne({ email });

//   if (!isUserExist) {
//     throw new AppError(StatusCodes.BAD_REQUEST, "User Not Found!");
//   }

//   const isPasswordMatched = await bcryptjs.compare(
//     password as string,
//     isUserExist.password as string,
//   );

//   if (!isPasswordMatched) {
//     throw new AppError(StatusCodes.BAD_REQUEST, "Incurrect Password!");
//   }



//   const userTokens = createUserTokens(isUserExist);

//   // delete password from user
//   const { password: _password, ...rest } = isUserExist.toObject();
//   // delete isUserExist.password;

//   return {
//     accessToken: userTokens.accessToken,
//     refreshToken: userTokens.refreshToken,
//     user: rest,
//   };
// };

// using refreshToken get new AccessToken

const getNewAccessToken = async (refreshToken: string) => {
  const accessToken =  await createAccessTokenWithRefreshToken(refreshToken);
  return  {accessToken};
};

// reset or change password
const changePassword = async (oldPassword:string, newPassword:string, decodedToken:JwtPayload) => {

  const user = await User.findById(decodedToken.userId);

  const isOldPasswordMatched = await bcryptjs.compare(oldPassword, user!.password as string);

  if(!isOldPasswordMatched){
    throw new AppError(StatusCodes.UNAUTHORIZED,"Old password doen't Matched");
  };

  const newHashedPassword = await bcryptjs.hash(newPassword, Number(envVars.BCRYPTJS_SALT_ROUND));


  // update user with new password
  user!.password= newHashedPassword;

  // save user
  user?.save();
};

// এই setPassword function-টা মূলত Google login করা user পরে manually password set করতে পারবে — এই feature implement করছে।
const setPassword = async (userId:string, plainPassword:string) => {

  const user = await User.findById(userId);

  if(!user){
    throw new AppError(StatusCodes.BAD_REQUEST, "User not Found!");
  }

  if(user.password && user.auths.some(providerObject => providerObject.provider === "google")){
    throw new AppError(StatusCodes.BAD_REQUEST, "You have already set your Password!. Now you can change the password from your Profile Update Password")
  }

  const hashPassword = await bcryptjs.hash(plainPassword, Number(envVars.BCRYPTJS_SALT_ROUND));

  const credentialsProvider : IAuthProvider = {
    provider:"credentials",
    providerId:user.email
  };

  const auths : IAuthProvider[] = [...user.auths, credentialsProvider];

  user.password = hashPassword;
  user.auths = auths;

  await user.save();
};



const resetPassword = async (oldPassword:string, newPassword:string, decodedToken:JwtPayload) => {

  const user = await User.findById(decodedToken.userId);

  const isOldPasswordMatched = await bcryptjs.compare(oldPassword, user!.password as string);

  if(!isOldPasswordMatched){
    throw new AppError(StatusCodes.UNAUTHORIZED,"Old password doen't Matched");
  };

  const newHashedPassword = await bcryptjs.hash(newPassword, Number(envVars.BCRYPTJS_SALT_ROUND));


  // update user with new password
  user!.password= newHashedPassword;

  // save user
  user?.save();
};

 
export const AuthServices = {
  getNewAccessToken,
  resetPassword,
  setPassword,
  changePassword
};
