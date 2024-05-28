"use server";

import { PAGES } from "@/data/page-map";
import { fromErrorToFormState } from "@/lib/utils";
import connectDB from "@/server/db/connect";
import { ApplicationStatus, FullApplication } from "@/types/application.types";
import { FormState } from "@/types/form.types";
import { Model } from "mongoose";
import { revalidatePath } from "next/cache";
import { getLoggedInUser } from "../auth/auth.actions";
import { ApplicationDocument } from "./application.types";
import { CreateApplicationSchema } from "./application.validation";

export async function getAllApplications(filter?: {
  status?: ApplicationStatus;
}) {
  try {
    const db = await connectDB();
    const applicationModel = db.models
      .Application as Model<ApplicationDocument>;

    const applications = await applicationModel
      .find(filter || {})
      .populate("asset")
      .populate("from", "-password")
      .populate("to", "-password");

    return JSON.parse(JSON.stringify(applications)) as FullApplication[];
  } catch (error: any) {
    console.log(error);
    return [];
  }
}

export async function getUserApplications(
  userId: string,
  filter?: { status?: ApplicationStatus }
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
      .populate("asset", "")
      .populate("from", "-password")
      .populate("to", "-password");

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
      asset: formData.get("asset"),
      from: user._id,
      to: formData.get("to"),
      reason: formData.get("reason") || undefined,
    });

    const db = await connectDB();
    const applicationModel = db.models
      .Application as Model<ApplicationDocument>;
    await applicationModel.create({
      ...validData,
      status: user.role === "admin" ? "Approved" : "Pending",
    });

    const response = {
      status: "SUCCESS",
      message: "transfer application created",
      timestamp: new Date().getTime(),
    } satisfies FormState;

    revalidatePath(PAGES.DASHBOARD);
    revalidatePath(PAGES.APPLICATIONS);
    return response;
  } catch (error: any) {
    return fromErrorToFormState(error);
  }
}
