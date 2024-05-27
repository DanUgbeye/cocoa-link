import mongoose from "mongoose";

export const applicationSchema = new mongoose.Schema({
  assetId: { type: String, required: true, ref: "Assets" },
  from: { type: String, required: true },
  to: { type: String, required: true },
  reason: { type: String, required: true },
  approved: { type: Boolean, required: true },
  approvedAt: { type: Date, default: null },
  adminId: { type: String, required: true },
  createdAt: { type: Date, required: true },
});
