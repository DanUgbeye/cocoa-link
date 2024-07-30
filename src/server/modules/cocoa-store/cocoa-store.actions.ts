"use server";

import { PAGES } from "@/data/page-map";
import { fromErrorToFormState } from "@/lib/utils";
import connectDB from "@/server/db/connect";
import { CocoaStore } from "@/types/cocoa-store.types";
import { FormState } from "@/types/form.types";
import { Model } from "mongoose";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getLoggedInUser } from "../auth/auth.actions";
import { CocoaStoreDocument } from "./cocoa-store.types";

export async function getCocoaStores(userId: string) {
  try {
    const db = await connectDB();
    const cocoaStoreModel = db.models.CocoaStore as Model<CocoaStoreDocument>;
    const cocoaStores = await cocoaStoreModel.find({ from: userId });

    return JSON.parse(JSON.stringify(cocoaStores)) as CocoaStore;
  } catch (error: any) {
    // console.log(error);
    return undefined;
  }
}

export async function getUserCocoaStore(userId: string) {
  try {
    const db = await connectDB();
    const cocoaStoreModel = db.models.CocoaStore as Model<CocoaStoreDocument>;
    const cocoaStores = await cocoaStoreModel.find({ from: userId });

    return JSON.parse(JSON.stringify(cocoaStores)) as CocoaStore;
  } catch (error: any) {
    // console.log(error);
    return undefined;
  }
}

export async function updateCocoaStore(
  formState: FormState,
  formData: FormData
) {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      throw new Error("Unauthorised");
    }

    let validData = z.object({ quantity: z.number() }).parse({
      quantity: formData.get("quantity"),
    });

    const db = await connectDB();
    const cocoaStoreModel = db.models.CocoaStore as Model<CocoaStoreDocument>;

    let updated = await cocoaStoreModel.findOneAndUpdate(
      { userId: user._id },
      validData
    );

    if (!updated) {
      throw new Error("Not found");
    }

    const response = {
      status: "SUCCESS",
      message: "transfer cocoaStore created",
      data: JSON.parse(JSON.stringify(updated)) as CocoaStore,
      timestamp: new Date().getTime(),
    } satisfies FormState<CocoaStore>;

    revalidatePath(PAGES.DASHBOARD);
    return response;
  } catch (error: any) {
    return fromErrorToFormState(error);
  }
}
