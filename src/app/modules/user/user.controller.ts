/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { User } from "./user.mode";



// create user
export const createUser = async (req:Request, res:Response) => {
  try {

    const {name, email} = req.body;
    const user = await User.create({name, email});

    res.status(StatusCodes.CREATED).json({
      message:"User created successfully!",
      user:user
    });

    
  } catch (err:any) {
    console.log(err);
    res.status(StatusCodes.BAD_REQUEST).json({
      message:`Something want wrong!! ${err.message}`,
      err:err
    })
  }
}


export const UserControllers = {
  createUser
}

