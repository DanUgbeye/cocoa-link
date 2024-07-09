import { USER_ROLES } from "@/types/user.types";
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
      enum: [USER_ROLES.INDUSTRY, USER_ROLES.FARMER],
      default: USER_ROLES.FARMER,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


