import mongoose from "mongoose";

export const applicationSchema = new mongoose.Schema(
  {
    asset: { type: mongoose.Types.ObjectId, required: true, ref: "assets" },
    from: { type: mongoose.Types.ObjectId, required: true, ref: "users" },
    to: { type: mongoose.Types.ObjectId, required: true, ref: "users" },
    reason: { type: String },
    approved: { type: Boolean, default: false },
    approvedAt: { type: Date, default: null },
    createdAt: { type: Date, required: true },
  },
  { timestamps: true }
);
