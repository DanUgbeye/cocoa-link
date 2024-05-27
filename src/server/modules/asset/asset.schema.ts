import mongoose from "mongoose";

export const assetSchema = new mongoose.Schema({
  userId: { type: String, required: true, ref: "Users" },
  name: { type: String, required: true },
  description: { type: String, required: true },
  currentLocation: { type: String, required: true },
  acquisitionDate: { type: Date, required: true },
  depreciationRate: { type: Number, required: true },
  purchaseCost: { type: Number, required: true, default: 0 },
  totalExpenditure: { type: Number, required: true, default: 0 },
  status: {
    type: String,
    enum: ["ACTIVE", "DAMAGED", "SOLD"],
    required: true,
  },
});
