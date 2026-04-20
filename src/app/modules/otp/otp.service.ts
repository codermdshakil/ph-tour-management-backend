import crypto from "crypto";
import { redisClient } from "../../config/redis.config";
import { sendEmail } from "../../utils/sendEmail";

const OLD_EXPIRATION = 2 * 60; // 2 minutes


const generateOTP = (length=6) => {
  // 6 digit
  
  const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString(); // 1,00,000 < 10,00,000 jar mane holo j 1 lakh theke 999999 er moddhe random digit dibe. ** mane holoe square

  return otp
}



const sentOTP = async (email:string, name:string) => {
 
  // store otp in redis DB with key,value and expiration
  
  const otp = generateOTP(); // value

  const redisKey = `otp:${otp}`; // key

  await redisClient.set(redisKey, otp, {
    expiration:{
      type:"EX",
      value:OLD_EXPIRATION
    }
  });
  

  // sent otp via email

  await sendEmail({
    to:email,
    subject:"Your OTP code",
    templateName:"otp", // template name otp.ejs use just name without .ejs extention
    templateData:{
      name:name,
      otp:otp
    }
  })

};

const verifyOTP = async () => {
  return {}
}



export const OTPService = {
  sentOTP,
  verifyOTP
}