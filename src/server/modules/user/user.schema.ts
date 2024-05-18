import { USER_ROLES } from "@/types/user.types";
import { UserDocument } from "./user.types";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema<UserDocument>(
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
      enum: [USER_ROLES.ADMIN, USER_ROLES.USER],
      default: USER_ROLES.USER,
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

export default userSchema;
