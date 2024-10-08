import { TransactionStatus, TransactionType } from "@/types";
import mongoose from "mongoose";
import { TransactionDocument } from "./transaction.types";

export const TransactionSchema = new mongoose.Schema<TransactionDocument>(
  {
    userId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    orderId: { type: mongoose.Types.ObjectId, required: false, ref: "Order" },
    amount: { type: Number, default: 0 },
    type: {
      type: String,
      required: true,
      enum: Object.values(TransactionType),
      default: TransactionType.Purchase,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.Pending,
    },
  },
  { timestamps: true }
);
