import bcryptjs from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHanlers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";

// create user
const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  // check user exist or not
  const isUserExist = await User.findOne({ email });

  // if (isUserExist) {
  //   throw new AppError(StatusCodes.BAD_REQUEST, "User Already Exist!");
  // }

  // auth provider
  const authProvider: IAuthProvider = {
    provider: "google",
    providerId: email as string,
  };

  const hashedPassword = await bcryptjs.hash(
    password as string,
    parseInt(envVars.BCRYPTJS_SALT_ROUND)
  );

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });

  return user;
};

// update user
const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {

  /**
   * 
   * check ifUserExist or not
   * email - can't update
   * name, phone, addres, password
   * password - re hashing
   * Only ADMIN, SUPER_ADMIN - role, isDeleted ....
   *
   * promoting to superadmin - superadmin
   *
   */

  // check user exist kore naki na

  const ifUserExist = await User.findById(userId);

  if(!ifUserExist){
    throw new AppError(StatusCodes.NOT_FOUND, "User not Found!!")
  }
 

  if (payload.role) {
   
    // jodi decodedToken a role user and guide thake tahole user er kono kichu update e korte dibo na
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(StatusCodes.FORBIDDEN, "You are not Authorized!!");
    }

    // SUPER_ADMIN ke just SUPER_ADMIN e promote ba change korte parbe 
    // promoting to superadmin - only superadmin

    if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
      throw new AppError(StatusCodes.FORBIDDEN, "You are not Authorized!!");
    }
  }

  // isActive, isDeleted, isVerified sodu ADMIN, SUPER_ADMIN e change korte parbe
  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(StatusCodes.FORBIDDEN, "You are not Authorized!!");
    }
  }

  // password re hashing
  if(payload.password){
    payload.password = await bcryptjs.hash(payload.password, parseInt(envVars.BCRYPTJS_SALT_ROUND));
  };


  const newUpdatedUser = await User.findByIdAndUpdate(userId,payload, {new:true, runValidators:true});

  return newUpdatedUser;

};

// get allUsers
const getAllUsers = async () => {
  const users = await User.find({});
  const totalUsers = await User.countDocuments();

  return {
    data: users,
    meta: {
      total: totalUsers,
    },
  };
};

export const UserServices = {
  createUser,
  updateUser,
  getAllUsers,
};
