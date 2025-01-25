"use server";

import { fromErrorToFormState, toFormState } from "@/lib/utils";
import connectDB from "@/server/db/connect";
import HttpException from "@/server/utils/http-exceptions";
import { Deal, DealStatus, FullDeal, FullDealWithUser } from "@/types";
import { FormState } from "@/types/form.types";
import { CocoaVariantSchema } from "@/validation";
import { Model } from "mongoose";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getLoggedInUser } from "../auth/auth.actions";
import { MetricDocument } from "../metric/metric.types";
import { DealDocument } from "./deal.types";
import { deleteUpload } from "../upload/upload.actions";

export async function getDeals() {
  try {
    const db = await connectDB();
    const dealModel: Model<DealDocument> = db.models.Deal;
    const deals = await dealModel.find().populate("image").populate("dealer");

    return JSON.parse(JSON.stringify(deals)) as FullDealWithUser[];
  } catch (error: any) {
    // console.log(error);
    return undefined;
  }
}

export async function getUserDeals(userId: string) {
  try {
    const db = await connectDB();
    const dealModel: Model<DealDocument> = db.models.Deal;
    const deals = await dealModel.find({ dealer: userId }).populate("image");

    return JSON.parse(JSON.stringify(deals)) as FullDeal[];
  } catch (error: any) {
    // console.log(error);
    return undefined;
  }
}

export async function createDeal(
  formState: FormState<FullDeal | undefined>,
  formData: FormData
) {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      throw new HttpException("Unauthorized", 401);
    }

    let dealData = z
      .object({
        quantity: z.number({ coerce: true }).min(1, "Quantity is required"),
        pricePerItem: z
          .number({ coerce: true })
          .min(1, "Price per item is required"),
        variant: CocoaVariantSchema,
        image: z.string().min(1, "Image is required"),
        location: z.string().nullable().default(null),
      })
      .parse({
        quantity: formData.get("quantity"),
        pricePerItem: formData.get("pricePerItem"),
        variant: formData.get("variant"),
        image: formData.get("image"),
        location: formData.get("location"),
      });

    const db = await connectDB();
    const dealModel: Model<DealDocument> = db.models.Deal;
    const metricModel = db.models.Metric as Model<MetricDocument>;

    // create deal
    const deal = await dealModel.create({ ...dealData, dealer: user._id });
    await deal.populate("image");

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
      JSON.parse(JSON.stringify(deal)) as FullDeal
    );
  } catch (error: any) {
    return fromErrorToFormState(error);
  }
}

export async function updateDeal(
  formState: FormState<FullDeal | undefined>,
  formData: FormData
) {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      throw new HttpException("Unauthorized", 401);
    }

    let { dealId, quantity, pricePerItem, variant, location } = z
      .object({
        dealId: z.string(),
        quantity: z.number({ coerce: true }).optional(),
        pricePerItem: z.number({ coerce: true }).optional(),
        variant: CocoaVariantSchema.optional(),
        location: z.string().nullable().default(null),
      })
      .parse({
        dealId: formData.get("dealId"),
        quantity: formData.get("quantity"),
        pricePerItem: formData.get("pricePerItem"),
        variant: formData.get("variant"),
        location: formData.get("location"),
      });

    const db = await connectDB();
    const metricModel = db.models.Metric as Model<MetricDocument>;
    const dealModel = db.models.Deal as Model<DealDocument>;
    const deal = await dealModel.findOne({ _id: dealId, dealer: user._id });

    if (!deal) {
      throw new HttpException("Deal not found", 404);
    }

    const metric = await metricModel.findOne({ userId: deal.dealer });

    if (!metric) {
      throw new HttpException("Something went wrong", 400);
    }

    if (pricePerItem) {
      deal.pricePerItem = pricePerItem;
    }

    if (quantity) {
      // update user metrics
      metric.totalQuantityProduced += quantity - deal.quantity;
      deal.quantity = quantity;
    }

    if (variant) {
      deal.variant = variant;
    }

    if (location) {
      deal.location = location;
    }

    await deal.populate("image");
    await deal.save();
    await metric.save();

    revalidatePath("/", "layout");

    return toFormState(
      "SUCCESS",
      "Deal updated",
      JSON.parse(JSON.stringify(deal)) as FullDeal
    );
  } catch (error: any) {
    return fromErrorToFormState(error);
  }
}

export async function deleteDeal(dealId: string) {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      throw new HttpException("Unauthorized", 401);
    }

    const db = await connectDB();
    const metricModel = db.models.Metric as Model<MetricDocument>;
    const dealModel = db.models.Deal as Model<DealDocument>;
    const deal = await dealModel.findOne({ _id: dealId });

    if (!deal) {
      throw new HttpException("Deal not found", 404);
    }

    const metric = await metricModel.findOne({ userId: deal.dealer });

    if (!metric) {
      throw new HttpException("Something went wrong");
    }

    if (String(deal.dealer) !== user._id) {
      throw new HttpException("Unauthorized", 403);
    }

    if (deal.status === DealStatus.Sold) {
      throw new HttpException("Deal already sold");
    }

    metric.totalQuantityProduced -= deal.quantity;

    await deleteUpload(String(deal.image));
    await metric.save();
    await deal.deleteOne();

    return true;
  } catch (error: any) {
    return new HttpException(error.message, error.status || 500);
  }
}
