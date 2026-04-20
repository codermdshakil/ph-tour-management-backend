import crypto from "crypto";
import { StatusCodes } from "http-status-codes";
import { redisClient } from "../../config/redis.config";
import AppError from "../../errorHanlers/AppError";
import { sendEmail } from "../../utils/sendEmail";
import { User } from "../user/user.model";

const OLD_EXPIRATION = 2 * 60; // 2 minutes

const generateOTP = (length = 6) => {
  // 6 digit

  const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString(); // 1,00,000 < 10,00,000 jar mane holo j 1 lakh theke 999999 er moddhe random digit dibe. ** mane holoe square

  return otp;
};

const sentOTP = async (email: string, name: string) => {
  // store otp in redis DB with key,value and expiration

  const otp = generateOTP(); // value

  const redisKey = `otp:${email}`; // key

  await redisClient.set(redisKey, otp, {
    expiration: {
      type: "EX",
      value: OLD_EXPIRATION,
    },
  });

  // sent otp via email

  await sendEmail({
    to: email,
    subject: "Your OTP code",
    templateName: "otp", // template name otp.ejs use just name without .ejs extention
    templateData: {
      name: name,
      otp: otp,
    },
  });
};

const verifyOTP = async (email: string, otp: string) => {
  const redisKey = `otp:${email}`;

  const savedOTP = await redisClient.get(redisKey);

  if (!savedOTP) {
     throw new AppError(StatusCodes.BAD_REQUEST, "Invalid OTP!");
  }

  if (savedOTP !== otp) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid OTP!");
  }

  await User.updateOne({email}, {isVerified:true}, {runValidators:true});
  await redisClient.del(redisKey);

};

export const OTPService = {
  sentOTP,
  verifyOTP,
};
