"use server";

import connectDB from "@/server/db/connect";
import { UserDocument } from "./user.types";
import { Model } from "mongoose";
import { User } from "@/types";

export async function getAllUsers() {
  try {
    const db = await connectDB();
    const userModel = db.models.User as Model<UserDocument>;
    const users = await userModel.find({ role: "user" });

    return JSON.parse(JSON.stringify(users)) as User[];
  } catch (error: any) {
    return [];
  }
}
