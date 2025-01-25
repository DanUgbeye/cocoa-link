import { CocoaVariant, DealStatus } from "@/types";
import mongoose from "mongoose";
import { DealDocument } from "./deal.types";

export const DealSchema = new mongoose.Schema<DealDocument>(
  {
    dealer: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    quantity: { type: Number, required: true, default: 0 },
    pricePerItem: { type: Number, required: true, default: 300_000 },
    variant: {
      type: String,
      required: true,
      enum: Object.values(CocoaVariant),
    },
    image: { type: mongoose.Types.ObjectId, required: true, ref: "Upload" },
    status: {
      type: String,
      required: true,
      enum: Object.values(DealStatus),
      default: DealStatus.Pending,
    },
    location: { type: String, required: false, default: null },
  },
  { timestamps: true }
);
