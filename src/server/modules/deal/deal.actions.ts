"use server";

import { fromErrorToFormState, toFormState } from "@/lib/utils";
import connectDB from "@/server/db/connect";
import HttpException from "@/server/utils/http-exceptions";
import { Deal } from "@/types";
import { FormState } from "@/types/form.types";
import { CocoaVariantSchema } from "@/validation";
import { Model } from "mongoose";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getLoggedInUser } from "../auth/auth.actions";
import { MetricDocument } from "../metric/metric.types";
import { DealDocument } from "./deal.types";

export async function getDeals() {
  try {
    const db = await connectDB();
    const dealModel: Model<DealDocument> = db.models.Deal;
    const deals = await dealModel.find();

    return JSON.parse(JSON.stringify(deals)) as Deal[];
  } catch (error: any) {
    // console.log(error);
    return undefined;
  }
}

export async function getUserDeals(userId: string) {
  try {
    const db = await connectDB();
    const dealModel: Model<DealDocument> = db.models.Deal;
    const deals = await dealModel.find({ dealer: userId });

    return JSON.parse(JSON.stringify(deals)) as Deal[];
  } catch (error: any) {
    // console.log(error);
    return undefined;
  }
}

export async function createDeal(
  formState: FormState<Deal | undefined>,
  formData: FormData
) {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      throw new HttpException("Unauthorized", 401);
    }

    let dealData = z
      .object({
        quantity: z.number({ coerce: true }),
        pricePerItem: z.number({ coerce: true }),
        variant: CocoaVariantSchema,
        image: z.string().url(),
      })
      .parse({
        quantity: formData.get("quantity"),
        pricePerItem: formData.get("pricePerItem"),
        variant: formData.get("variant"),
        image: formData.get("image"),
      });

    const db = await connectDB();
    const dealModel: Model<DealDocument> = db.models.Deal;
    const metricModel = db.models.Metric as Model<MetricDocument>;

    // create deal
    const deal = await dealModel.create({ ...dealData, dealer: user._id });

    // update user metrics
    await metricModel.findOneAndUpdate(
      { userId: user._id },
      {
        $inc: {
          totalQuantityProduced: dealData.quantity,
        },
      }
    );

    revalidatePath("/", "layout");

    return toFormState(
      "SUCCESS",
      "Deal updated",
      JSON.parse(JSON.stringify(deal)) as Deal
    );
  } catch (error: any) {
    return fromErrorToFormState(error);
  }
}

export async function updateDeal(formState: FormState, formData: FormData) {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      throw new HttpException("Unauthorized", 401);
    }

    let { dealId, quantity, pricePerItem, variant } = z
      .object({
        dealId: z.string(),
        quantity: z.number({ coerce: true }).optional(),
        pricePerItem: z.number({ coerce: true }).optional(),
        variant: CocoaVariantSchema.optional(),
      })
      .parse({
        dealId: formData.get("dealId"),
        quantity: formData.get("quantity"),
        pricePerItem: formData.get("pricePerItem"),
        variant: formData.get("variant"),
      });

    const db = await connectDB();
    const dealModel = db.models.Deal as Model<DealDocument>;
    const deal = await dealModel.findOne({ _id: dealId, dealer: user._id });

    if (!deal) {
      throw new HttpException("Deal not found", 404);
    }

    if (pricePerItem) {
      deal.pricePerItem = pricePerItem;
    }

    if (quantity) {
      deal.quantity = quantity;
    }

    if (variant) {
      deal.variant = variant;
    }

    await deal.save();

    revalidatePath("/", "layout");

    return toFormState(
      "SUCCESS",
      "Deal updated",
      JSON.parse(JSON.stringify(deal)) as Deal
    );
  } catch (error: any) {
    return fromErrorToFormState(error);
  }
}
