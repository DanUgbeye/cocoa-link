import { CocoaVariant, DealStatus } from "@/types";
import mongoose from "mongoose";

export const DealSchema = new mongoose.Schema(
  {
    dealer: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    quantity: { type: Number, required: true, default: 0 },
    pricePerItem: { type: Number, required: true, default: 300_000 },
    variant: {
      type: String,
      required: true,
      enum: Object.values(CocoaVariant),
    },
    image: { type: String },
    status: {
      type: String,
      required: true,
      enum: Object.values(DealStatus),
    },
  },
  { timestamps: true }
);
