import { Schema } from "mongoose";

export const activitySchema = new Schema({
  asset: {
    type: String,
    ref: "Asset",
    required: true,
  },
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
