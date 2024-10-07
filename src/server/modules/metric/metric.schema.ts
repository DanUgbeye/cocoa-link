import mongoose from "mongoose";

export const MetricSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    totalAmountSold: { type: Number, required: true, default: 0 },
    totalQuantitySold: { type: Number, required: true, default: 0 },
    totalQuantityProduced: { type: Number, required: true, default: 0 },
    totalQuantityPurchased: { type: Number, required: true, default: 0 },
    totalAmountSpent: { type: Number, required: true, default: 0 },
    totalAmountDeposited: { type: Number, required: true, default: 0 },
    totalAmountWithdrawn: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);
