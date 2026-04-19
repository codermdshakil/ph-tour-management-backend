import { Types } from "mongoose";

export type GuideApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface IGuideApplication {
  user: Types.ObjectId;
  nidPhoto?: string;
  division?: Types.ObjectId;
  status?: GuideApplicationStatus;
}
