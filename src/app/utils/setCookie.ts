
import { Response } from "express";


export interface AuthToken {
  accessToken?: string;
  refreshToken?: string;
}



export const setAuthCookie = (res: Response, tokenInfo:AuthToken) => {

  if(tokenInfo.accessToken){
    // set accessToken to cookies
    res.cookie("accessToken", tokenInfo.accessToken, {
      httpOnly: true, // MUST have
      secure: false,
      sameSite: "strict",
    });
  }

   if(tokenInfo.refreshToken){
    // set refreshToken to cookies
    res.cookie("refreshToken", tokenInfo.refreshToken, {
      httpOnly: true, // MUST have
      secure: false,
      sameSite: "strict",
    });
   }
};
