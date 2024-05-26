"use server";

import connectDB from "@/server/db/connect";
import { AssetDocument } from "./asset.types";
import { Model } from "mongoose";

export async function getAllAssets() {
  try {
    const db = await connectDB();
    const assetModel = db.models.Asset as Model<AssetDocument>;

    return await assetModel.find();
  } catch (error: any) {
    return [];
  }
}
