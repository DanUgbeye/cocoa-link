import { UserRole } from "@/types/user.types";
import mongoose from "mongoose";
import { UserDocument } from "./user.types";

export const userSchema = new mongoose.Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
      enum: Object.values(UserRole),
      default: UserRole.Farmer,
    },
    password: {
      type: String,
      required: true,
    },
    walletBalance: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
