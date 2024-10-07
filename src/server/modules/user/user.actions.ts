"use server";

import { fromErrorToFormState, toFormState } from "@/lib/utils";
import connectDB from "@/server/db/connect";
import { FormState, TransactionStatus, TransactionType, User } from "@/types";
import { Model } from "mongoose";
import { z } from "zod";
import { getLoggedInUser } from "../auth/auth.actions";
import { TransactionDocument } from "../transaction/transaction.types";
import { UserDocument } from "./user.types";
import { revalidatePath } from "next/cache";
import { MetricDocument } from "../metric/metric.types";

export async function getAllUsers() {
  try {
    const db = await connectDB();
    const userModel = db.models.User as Model<UserDocument>;
    const users = await userModel.find({ role: "user" });

    return JSON.parse(JSON.stringify(users)) as User[];
  } catch (error: any) {
    return [];
  }
}

export async function depositToWallet(
  formState: FormState,
  formData: FormData
) {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      throw new Error("UnAuthorized");
    }

    const depositAmount = z
      .number({ coerce: true })
      .parse(formData.get("amount"));

    const db = await connectDB();
    const userModel = db.models.User as Model<UserDocument>;
    const metricModel = db.models.Metric as Model<MetricDocument>;
    const transactionModel = db.models
      .Transaction as Model<TransactionDocument>;

    // update wallet balance
    const userUpdate = await userModel.findByIdAndUpdate(
      user._id,
      { $inc: { walletBalance: depositAmount } },
      { new: true }
    );

    if (!userUpdate) {
      throw new Error("user not found");
    }

    // create deposit transaction
    await transactionModel.create({
      userId: user._id,
      amount: depositAmount,
      status: TransactionStatus.Success,
      type: TransactionType.Deposit,
    });

    // update user metrics
    await metricModel.findOneAndUpdate(
      { userId: user._id },
      {
        $inc: {
          totalAmountDeposited: depositAmount,
        },
      }
    );

    revalidatePath("/", "layout");

    return toFormState(
      "SUCCESS",
      "success",
      JSON.parse(JSON.stringify(userUpdate))
    );
  } catch (error: any) {
    return fromErrorToFormState(error);
  }
}

export async function withdrawFromWallet(
  formState: FormState,
  formData: FormData
) {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      throw new Error("UnAuthorized");
    }

    const withdrawalAmount = z
      .number({ coerce: true })
      .parse(formData.get("amount"));

    if (withdrawalAmount > user.walletBalance) {
      throw new Error("withdrawal amount is greater than wallet balance");
    }

    const db = await connectDB();
    const userModel = db.models.User as Model<UserDocument>;
    const metricModel = db.models.Metric as Model<MetricDocument>;
    const transactionModel = db.models
      .Transaction as Model<TransactionDocument>;

    // debit user wallet
    const userUpdate = await userModel.findByIdAndUpdate(
      user._id,
      { $inc: { walletBalance: -withdrawalAmount } },
      { new: true }
    );

    if (!userUpdate) {
      throw new Error("user not found");
    }

    // create withdrawal transaction
    await transactionModel.create({
      userId: user._id,
      amount: -withdrawalAmount,
      status: TransactionStatus.Success,
      type: TransactionType.Withdrawal,
    });

    // update user metrics
    await metricModel.findOneAndUpdate(
      { userId: user._id },
      {
        $inc: {
          totalAmountWithdrawn: withdrawalAmount,
        },
      }
    );

    revalidatePath("/", "layout");

    return toFormState(
      "SUCCESS",
      "success",
      JSON.parse(JSON.stringify(userUpdate))
    );
  } catch (error: any) {
    return fromErrorToFormState(error);
  }
}
