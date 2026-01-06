import bcryptjs from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHanlers/AppError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";

// create user
const createUser = async (payload: Partial<IUser>) => {


  const { email, password, ...rest } = payload;

  // check user exist or not
  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User Already Exist!");
  }

  // auth provider 
  const authProvider: IAuthProvider = {
    provider: "google",
    providerId: email as string,
  };

  
  const hashedPassword = await bcryptjs.hash(password as string, 10);

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });

  return user;
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
  getAllUsers,
};
