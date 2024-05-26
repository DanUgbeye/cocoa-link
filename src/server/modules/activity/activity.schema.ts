import { Schema } from "mongoose";
import { ActivityDocument } from "./activity.types";

export const activitySchema = new Schema<ActivityDocument>({
  id: { type: String, required: true, unique: true },
  type: {
    type: String,
    enum: [
      "DAMAGE",
      "REPAIR",
      "UPGRADE",
      "MAINTENANCE",
      "PURCHASE",
      "INSPECTION",
      "SALE",
      "TRANSFER",
    ],
    required: true,
  },
  applicationId: { type: String, required: false },
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
});
