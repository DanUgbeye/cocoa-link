import mongoose from "mongoose";

export const applicationSchema = new mongoose.Schema(
  {
    asset: {
      type: String,
      unique: false,
      required: true,
      ref: "Asset",
    },
    from: {
      type: String,
      unique: false,
      required: true,
      ref: "User",
    },
    to: {
      type: String,
      unique: false,
      required: true,
      ref: "User",
    },
    reason: { type: String },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);
