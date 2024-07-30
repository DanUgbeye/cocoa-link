"use server";

import { fromErrorToFormState, toFormState } from "@/lib/utils";
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

export async function updateCocoaStoreQuantity(
  formState: FormState,
  formData: FormData
) {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      throw new Error("Unauthorised");
    }

    let { quantity: quantityToAdd, pricePerItem } = z
      .object({
        quantity: z.number({ coerce: true }),
        pricePerItem: z.number({ coerce: true }),
      })
      .parse({
        quantity: formData.get("quantity"),
        pricePerItem: formData.get("pricePerItem"),
      });

    const db = await connectDB();
    const cocoaStoreModel = db.models.CocoaStore as Model<CocoaStoreDocument>;
    const cocoaStore = await cocoaStoreModel.findOne({ userId: user._id });

    if (!cocoaStore) {
      throw new Error("not found");
    }

    let updated = await cocoaStoreModel.findOneAndUpdate(
      { userId: user._id },
      {
        quantity: cocoaStore.quantity + quantityToAdd,
        totalQuantityProduced: cocoaStore.totalQuantityProduced + quantityToAdd,
        pricePerItem,
      },
      { new: true }
    );

    if (!updated) {
      throw new Error("Not found");
    }

    revalidatePath("/", "layout");

    return toFormState(
      "SUCCESS",
      "quantity updated",
      JSON.parse(JSON.stringify(updated))
    );
  } catch (error: any) {
    return fromErrorToFormState(error);
  }
}
