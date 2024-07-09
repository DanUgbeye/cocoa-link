import { TRANSACTION_STATUS, TRANSACTION_TYPE } from "@/types";
import mongoose from "mongoose";

export const TransactionSchema = new mongoose.Schema(
  {
    buyerId: { type: String, required: true, ref: "User" },
    sellerId: { type: String, required: true, ref: "User" },
    quantity: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
    type: {
      type: String,
      required: true,
      enum: [
        TRANSACTION_TYPE.DEPOSIT,
        TRANSACTION_TYPE.SALE,
        TRANSACTION_TYPE.WITHDRAWAL,
      ],
      default: TRANSACTION_TYPE.SALE,
    },
    status: {
      type: String,
      required: true,
      enum: [
        TRANSACTION_STATUS.SUCCESS,
        TRANSACTION_STATUS.FAILED,
        TRANSACTION_STATUS.PENDING,
      ],
      default: TRANSACTION_STATUS.PENDING,
    },
  },
  { timestamps: true }
);
