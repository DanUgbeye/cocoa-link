import mongoose from "mongoose";
import { UploadDocument } from "./upload.types";

export const UploadSchema = new mongoose.Schema<UploadDocument>(
  {
    userId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    name: { type: String },
    size: { type: Number },
    type: { type: String },
    key: { type: String },
    url: { type: String },
    appUrl: { type: String },
  },
  { timestamps: true }
);
