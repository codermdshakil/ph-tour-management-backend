import { model, Schema } from "mongoose";
import { IGuideApplication } from "./guide.interface";

const guideApplicationSchema = new Schema<IGuideApplication>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    nidPhoto: {
      type: String,
      required: true,
    },
    division: {
      type: Schema.Types.ObjectId,
      ref: "Division",
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);


 
export const GuideApplication = model<IGuideApplication>("GuideApplication", guideApplicationSchema);




