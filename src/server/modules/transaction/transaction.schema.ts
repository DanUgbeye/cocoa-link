import { TRANSACTION_STATUS, TRANSACTION_TYPE } from "@/types";
import mongoose from "mongoose";

export const TransactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    amount: { type: Number, default: 0 },
    type: {
      type: String,
      required: true,
      enum: Object.values(TRANSACTION_TYPE),
      default: TRANSACTION_TYPE.PURCHASE,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(TRANSACTION_STATUS),
      default: TRANSACTION_STATUS.PENDING,
    },
  },
  { timestamps: true }
);
