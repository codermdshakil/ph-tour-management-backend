import { model, Schema } from "mongoose";
import { IDivition } from "./division.interface";


const divisionSchema = new Schema<IDivition>({
  name:{
    type:String,
    required:true,
    unique:true
  },
  slug:{
    type:String,
    unique:true
  },
  thumbnail:{
    type:String,
  },
  description:{
    type:String
  }
},{
  timestamps:true,
});

export const Division = model<IDivition>("Division", divisionSchema);


