import mongoose from "mongoose";

const { Schema, model } = mongoose;

export const applicationSchema = new Schema({
  id: { type: String, required: true, unique: true },
  assetId: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  reason: { type: String, required: true },
  approved: { type: Boolean, required: true },
  approvedAt: { type: Date, default: null },
  adminId: { type: String, required: true },
  createdAt: { type: Date, required: true },
});
