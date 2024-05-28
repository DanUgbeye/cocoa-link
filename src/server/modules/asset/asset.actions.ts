"use server";

import { PAGES } from "@/data/page-map";
import { fromErrorToFormState } from "@/lib/utils";
import connectDB from "@/server/db/connect";
import { Asset } from "@/types/asset.types";
import { FormState } from "@/types/form.types";
import { Model } from "mongoose";
import { revalidatePath } from "next/cache";
import { getLoggedInUser } from "../auth/auth.actions";
import { AssetDocument } from "./asset.types";
import { CreateAssetSchema } from "./asset.validation";

export async function getAllAssets() {
  try {
    const db = await connectDB();
    const assetModel = db.models.Asset as Model<AssetDocument>;

    return JSON.parse(JSON.stringify(await assetModel.find())) as Asset[];
  } catch (error: any) {
    return [];
  }
}

export async function getUserAssets(userId: string) {
  try {
    const db = await connectDB();
    const assetModel = db.models.Asset as Model<AssetDocument>;

    return JSON.parse(
      JSON.stringify(await assetModel.find({ userId }))
    ) as Asset[];
  } catch (error: any) {
    return [];
  }
}

export async function createAsset(formState: FormState, formData: FormData) {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      throw new Error("Unauthorised");
    }

    let validData = CreateAssetSchema.parse({
      name: formData.get("name"),
      description: formData.get("description"),
      currentLocation: formData.get("currentLocation"),
      acquisitionDate: formData.get("acquisitionDate"),
      depreciationRate: formData.get("depreciationRate"),
      purchaseCost: formData.get("purchaseCost"),
      status: formData.get("status") || "Active",
    });

    const db = await connectDB();
    const assetModel = db.models.Asset as Model<AssetDocument>;
    await assetModel.create({ ...validData, userId: user._id });

    const response = {
      status: "SUCCESS",
      message: "asset created",
      timestamp: new Date().getTime(),
    } satisfies FormState;

    revalidatePath(PAGES.DASHBOARD);
    revalidatePath(PAGES.ASSETS);
    return response;
  } catch (error: any) {
    console.log(error);
    return fromErrorToFormState(error);
  }
}
