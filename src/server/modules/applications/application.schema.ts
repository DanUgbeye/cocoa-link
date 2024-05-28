import mongoose from "mongoose";

export const applicationSchema = new mongoose.Schema(
  {
    asset: { type: mongoose.Types.ObjectId, required: true, ref: "Asset" },
    from: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    to: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    reason: { type: String },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);
