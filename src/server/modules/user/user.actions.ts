"use server";

import connectDB from "@/server/db/connect";
import { User } from "@/types";
import { Model } from "mongoose";
import { UserDocument } from "./user.types";

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
