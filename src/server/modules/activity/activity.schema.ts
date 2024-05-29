import { Schema } from "mongoose";
import { ActivityDocument } from "./activity.types";

export const activitySchema = new Schema<ActivityDocument>({
  type: {
    type: String,
    enum: [
      "Damage",
      "Repair",
      "Upgrade",
      "Maintenance",
      "Purchase",
      "Inspection",
      "Sale",
      "Transfer",
    ],
    required: true,
  },
  date: { type: Date, default: new Date() },
  amount: { type: Number, default: 0 },
});
