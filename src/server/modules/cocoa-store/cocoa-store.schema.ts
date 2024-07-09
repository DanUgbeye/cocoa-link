import mongoose from "mongoose";

export const CocoaStoreSchema = new mongoose.Schema(
  {
    user: { type: String, required: true, ref: "User" },
    quantity: { type: Number, required: true, default: 0 },
    pricePerItem: { type: Number, required: true, default: 300 },
    totalAmountSold: { type: Number, required: true, default: 0 },
    totalSold: { type: Number, required: true, default: 0 },
    totalQuantity: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);
