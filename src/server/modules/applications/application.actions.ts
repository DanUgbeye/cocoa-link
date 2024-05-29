"use server";

import { PAGES } from "@/data/page-map";
import { fromErrorToFormState } from "@/lib/utils";
import connectDB from "@/server/db/connect";
import {
  Application,
  FullApplication
} from "@/types/application.types";
import { Asset } from "@/types/asset.types";
import { FormState } from "@/types/form.types";
import { Model } from "mongoose";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ActivityDocument } from "../activity/activity.types";
import { AssetDocument } from "../asset/asset.types";
import { getLoggedInUser } from "../auth/auth.actions";
import { ApplicationDocument } from "./application.types";
import { CreateApplicationSchema } from "./application.validation";

export async function getAllApplications() {
  try {
    const db = await connectDB();
    const applicationModel = db.models
      .Application as Model<ApplicationDocument>;

    const applications = await applicationModel
      .find()
      .populate("asset")
      .populate("from", "-password")
      .populate("to", "-password");

    return JSON.parse(JSON.stringify(applications)) as FullApplication[];
  } catch (error: any) {
    console.log(error);
    return [];
  }
}

export async function getUserApplications(userId: string) {
  try {
    const db = await connectDB();
    const applicationModel = db.models
      .Application as Model<ApplicationDocument>;

    const applications = await applicationModel
      .find({ from: userId })
      .populate("asset", "")
      .populate("from", "-password")
      .populate("to", "-password");

    return JSON.parse(JSON.stringify(applications)) as FullApplication[];
  } catch (error: any) {
    console.log(error);
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

    let alreadyExists = await applicationModel.findOne({
      from: validData.from,
      to: validData.to,
      asset: validData.asset,
      status: "Pending",
    });

    if (alreadyExists) {
      throw new Error("pending application exists for this asset");
    }

    const application = await applicationModel.create({
      ...validData,
      status: user.role === "admin" ? "Approved" : "Pending",
    });

    const fullApplication = (await application.populate("asset")) as Omit<
      Application,
      "asset"
    > & { asset: Asset };

    if (user.role === "admin") {
      // CHANGE ASSET OWNER
      const assetModel = db.models.Asset as Model<AssetDocument>;
      await assetModel.updateOne(
        {
          _id: fullApplication.asset._id,
        },
        { userId: fullApplication.to }
      );

      // ADD NEW ACTIVITY
      const activityModel = db.models.Activity as Model<ActivityDocument>;
      await activityModel.create({
        asset: fullApplication.asset._id,
        type: "Transfer",
      });
    }

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

export async function approveApplication(
  formState: FormState,
  formData: FormData
) {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      throw new Error("Unauthorised");
    }

    let applicationId = z.string().parse(formData.get("applicationId"));
    const db = await connectDB();
    const applicationModel = db.models
      .Application as Model<ApplicationDocument>;
    const application = (await applicationModel
      .findOne({ _id: applicationId })
      .populate("asset")) as unknown as Omit<Application, "asset"> & {
      asset: Asset;
    };

    if (!application) {
      throw new Error("Application not found");
    }

    if (user.role !== "admin") {
      if (application.asset && application.asset.userId !== user._id) {
        throw new Error("Unauthorised");
      }
    }

    const res = await applicationModel.updateOne(
      { _id: applicationId },
      { status: "Approved" },
      { new: true }
    );

    if (!res) {
      throw new Error("Application not found");
    }

    // CHANGE ASSET OWNER
    const assetModel = db.models.Asset as Model<AssetDocument>;
    await assetModel.updateOne(
      {
        _id: application.asset._id,
      },
      { userId: application.to }
    );

    // ADD NEW ACTIVITY
    const activityModel = db.models.Activity as Model<ActivityDocument>;
    await activityModel.create({
      asset: application.asset._id,
      type: "Transfer",
    });

    revalidatePath(PAGES.APPLICATIONS);
    revalidatePath(PAGES.DASHBOARD);

    return {
      status: "SUCCESS",
      message: "transfer approved",
      timestamp: new Date().getTime(),
    } satisfies FormState;
  } catch (error: any) {
    return fromErrorToFormState(error);
  }
}

export async function rejectApplication(
  formState: FormState,
  formData: FormData
) {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      throw new Error("Unauthorised");
    }

    let applicationId = z.string().parse(formData.get("applicationId"));
    const db = await connectDB();
    const applicationModel = db.models
      .Application as Model<ApplicationDocument>;
    const application = await applicationModel
      .findOne({ _id: applicationId })
      .populate("asset");

    if (!application) {
      throw new Error("Application not found");
    }

    if (user.role !== "admin") {
      if (
        application.asset &&
        (application.asset as unknown as Asset).userId !== user._id
      ) {
        throw new Error("Unauthorised");
      }
    }

    const res = await applicationModel.updateOne(
      { _id: applicationId },
      { status: "Rejected" },
      { new: true }
    );

    if (!res) {
      throw new Error("Application not found");
    }

    revalidatePath(PAGES.APPLICATIONS);
    revalidatePath(PAGES.DASHBOARD);

    return {
      status: "SUCCESS",
      message: "transfer rejected",
      timestamp: new Date().getTime(),
    } satisfies FormState;
  } catch (error: any) {
    return fromErrorToFormState(error);
  }
}

export async function deleteApplication(
  formState: FormState,
  formData: FormData
) {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      throw new Error("Unauthorised");
    }

    let applicationId = z.string().parse(formData.get("applicationId"));
    const db = await connectDB();
    const applicationModel = db.models
      .Application as Model<ApplicationDocument>;
    const application = await applicationModel
      .findOne({ _id: applicationId })
      .populate("asset");

    if (!application) {
      throw new Error("Application not found");
    }

    if (user.role !== "admin") {
      if (
        application.asset &&
        (application.asset as unknown as Asset).userId !== user._id
      ) {
        throw new Error("Unauthorised");
      }
    }

    const res = await applicationModel.deleteOne({ _id: applicationId });
    if (!res) {
      throw new Error("Application not found");
    }

    revalidatePath(PAGES.APPLICATIONS);
    revalidatePath(PAGES.DASHBOARD);

    return {
      status: "SUCCESS",
      message: "transfer deleted",
      timestamp: new Date().getTime(),
    } satisfies FormState;
  } catch (error: any) {
    return fromErrorToFormState(error);
  }
}
