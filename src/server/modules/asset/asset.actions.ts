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
import { z } from "zod";
import { ActivityDocument } from "../activity/activity.types";

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

export async function getAsset(assetId: string) {
  try {
    const db = await connectDB();
    const assetModel = db.models.Asset as Model<AssetDocument>;

    return JSON.parse(
      JSON.stringify(await assetModel.findOne({ _id: assetId }))
    ) as Asset;
  } catch (error: any) {
    return undefined;
  }
}

export async function createAsset(formState: FormState, formData: FormData) {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      throw new Error("Unauthorised");
    }
    console.log(JSON.stringify(formData.entries(), null, 2), "formData");

    let validData = CreateAssetSchema.parse({
      name: formData.get("name"),
      description: formData.get("description"),
      currentLocation: formData.get("currentLocation"),
      acquisitionDate: formData.get("acquisitionDate"),
      depreciationRate: formData.get("depreciationRate"),
      purchaseCost: formData.get("purchaseCost"),
      status: formData.get("status") || "Active",
    });
    console.log(JSON.stringify(validData), "validData")

    const db = await connectDB();
    const assetModel = db.models.Asset as Model<AssetDocument>;
    const asset = (await assetModel.create({
      ...validData,
      userId: user._id,
    })) as unknown as Asset;

    const activityModel = db.models.Activity as Model<ActivityDocument>;
    await activityModel.create({
      asset: asset._id,
      type: "Purchase",
      date: asset.acquisitionDate,
      amount: asset.purchaseCost,
    });

    revalidatePath(PAGES.DASHBOARD);
    revalidatePath(PAGES.ASSETS);

    return {
      status: "SUCCESS",
      message: "asset created",
      timestamp: new Date().getTime(),
    } satisfies FormState;
  } catch (error: any) {
    console.log(error);
    return fromErrorToFormState(error);
  }
}

export async function deleteAsset(formState: FormState, formData: FormData) {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      throw new Error("Unauthorised");
    }

    let assetId = z.string().parse(formData.get("assetId"));

    const db = await connectDB();
    const assetModel = db.models.Asset as Model<AssetDocument>;
    const asset = (await assetModel.findOne({ _id: assetId })) as Asset | null;

    if (!asset) {
      throw new Error("asset not found");
    }

    if (user.role !== "admin" && asset.userId !== user._id) {
      throw new Error("Unauthorised");
    }

    await assetModel.deleteOne({ _id: assetId });

    revalidatePath(PAGES.DASHBOARD);
    revalidatePath(PAGES.ASSETS);

    return {
      status: "SUCCESS",
      message: "asset deleted",
      timestamp: new Date().getTime(),
    } satisfies FormState;
  } catch (error: any) {
    return fromErrorToFormState(error);
  }
}
