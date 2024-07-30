import mongoose from "mongoose";

export const PaymentSchema = new mongoose.Schema(
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
  },
  { timestamps: true }
);
