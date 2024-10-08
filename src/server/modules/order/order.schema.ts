import { OrderStatus } from "@/types";
import mongoose from "mongoose";
import { OrderDocument } from "./order.types";

export const OrderSchema = new mongoose.Schema<OrderDocument>(
  {
    buyerId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    sellerId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    dealId: { type: mongoose.Types.ObjectId, required: true, ref: "Deal" },
    amount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Pending,
    },
    location: { type: String },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);
