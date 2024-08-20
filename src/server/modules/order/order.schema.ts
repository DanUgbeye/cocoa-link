import { ORDER_STATUS } from "@/types";
import mongoose from "mongoose";

export const OrderSchema = new mongoose.Schema(
  {
    buyerId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    sellerId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    transactionId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Transaction",
    },
    quantity: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING,
    },
    location: { type: String },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);
