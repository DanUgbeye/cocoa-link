"use server";

import connectDB from "@/server/db/connect";
import { Model } from "mongoose";
import { ActivityDocument } from "./activity.types";
import { Activity } from "@/types/activity.types";
import { FormState } from "@/types/form.types";
import { getLoggedInUser } from "../auth/auth.actions";
import { createActivitySchema } from "./activity.validation";
import { revalidatePath } from "next/cache";
import { PAGES } from "@/data/page-map";
import { fromErrorToFormState } from "@/lib/utils";

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

export async function createActivity(formState: FormState, formData: FormData) {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      throw new Error("Unauthorised");
    }

    let validData = createActivitySchema.parse({
      asset: formData.get("asset"),
      type: formData.get("type"),
      date: formData.get("date") || new Date(),
      amount: formData.get("amount") || 0,
    });

    // VERIFY THE ACTIVITY TYPE & AMOUNT SIGN
    switch (true) {
      case ["Repair", "Upgrade", "Maintenance", "Purchase"].includes(
        validData.type
      ): {
        if (validData.amount !== 0 && validData.amount > 0) {
          validData.amount = -validData.amount;
        }
        break;
      }

      case ["Damage", "Inspection", "Transfer"].includes(validData.type): {
        if (validData.amount !== 0) {
          validData.amount = 0;
        }

        break;
      }

      case ["Sale"].includes(validData.type): {
        if (validData.amount < 0) {
          validData.amount = Math.abs(validData.amount);
        }

        break;
      }
    }

    const db = await connectDB();
    const activityModel = db.models.Activity as Model<ActivityDocument>;
    await activityModel.create({ ...validData });

    revalidatePath(PAGES.DASHBOARD);
    revalidatePath(PAGES.ASSETS, "layout");

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
