"use server";

import connectDB from "@/server/db/connect";
import { Model } from "mongoose";
import { ActivityDocument } from "./activity.types";
import { Activity } from "@/types/activity.types";

export async function getAssetActivities(assetId: string) {
  try {
    const db = await connectDB();
    const activityModel = db.models.Activity as Model<ActivityDocument>;

    const activities = await activityModel.find({ asset: assetId });
    return JSON.parse(JSON.stringify(activities)) as Activity[];
  } catch (error: any) {
    return [];
  }
}
