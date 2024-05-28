"use server";

import { PAGES } from "@/data/page-map";
import { fromErrorToFormState } from "@/lib/utils";
import connectDB from "@/server/db/connect";
import { FullApplication } from "@/types/application.types";
import { FormState } from "@/types/form.types";
import { Model } from "mongoose";
import { revalidatePath } from "next/cache";
import { getLoggedInUser } from "../auth/auth.actions";
import { ApplicationDocument } from "./application.types";
import { CreateApplicationSchema } from "./application.validation";

export async function getAllApplications(filter?: { approved?: boolean }) {
  try {
    const db = await connectDB();
    const applicationModel = db.models
      .Application as Model<ApplicationDocument>;

    const applications = await applicationModel
      .find(filter || {})
      .populate("asset", "", "assets")
      .populate("from", "-password", "users")
      .populate("to", "-password", "users");

    return JSON.parse(JSON.stringify(applications)) as FullApplication[];
  } catch (error: any) {
    return [];
  }
}

export async function getUserApplications(
  userId: string,
  filter?: { approved?: boolean }
) {
  try {
    const db = await connectDB();
    const applicationModel = db.models
      .Application as Model<ApplicationDocument>;

    const applications = await applicationModel
      .find({
        userId,
        ...(filter || {}),
      })
      .populate("asset", "", "assets")
      .populate("from", "-password", "users")
      .populate("to", "-password", "users");

    return JSON.parse(JSON.stringify(applications)) as FullApplication[];
  } catch (error: any) {
    return [];
  }
}

export async function createApplication(
  formState: FormState,
  formData: FormData
) {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      throw new Error("Unauthorised");
    }

    let validData = CreateApplicationSchema.parse({
      assetId: formData.get("assetId"),
      from: user._id,
      to: formData.get("to"),
      reason: formData.get("reason") || undefined,
    });

    const db = await connectDB();
    const applicationModel = db.models
      .Application as Model<ApplicationDocument>;
    await applicationModel.create({ ...validData });

    const response = {
      status: "SUCCESS",
      message: "asset created",
      timestamp: new Date().getTime(),
    } satisfies FormState;

    revalidatePath(PAGES.DASHBOARD);
    revalidatePath(PAGES.APPLICATIONS);
    return response;
  } catch (error: any) {
    return fromErrorToFormState(error);
  }
}
