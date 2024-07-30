"use server";

import { fromErrorToFormState, toFormState } from "@/lib/utils";
import connectDB from "@/server/db/connect";
import { FormState, TRANSACTION_STATUS, TRANSACTION_TYPE, User } from "@/types";
import { Model } from "mongoose";
import { z } from "zod";
import { getLoggedInUser } from "../auth/auth.actions";
import { TransactionDocument } from "../transaction/transaction.types";
import { UserDocument } from "./user.types";
import { revalidatePath } from "next/cache";

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
      throw new Error("UnAuthorised");
    }

    const depositAmount = z
      .number({ coerce: true })
      .parse(formData.get("amount"));

    const db = await connectDB();
    const userModel = db.models.User as Model<UserDocument>;
    const transactionModel = db.models
      .Transaction as Model<TransactionDocument>;

    const userUpdate = await userModel.findByIdAndUpdate(
      user._id,
      { walletBalance: user.walletBalance + depositAmount },
      { new: true }
    );

    await transactionModel.create({
      userId: user._id,
      amount: depositAmount,
      status: TRANSACTION_STATUS.SUCCESS,
      type: TRANSACTION_TYPE.DEPOSIT,
    });

    if (!userUpdate) {
      throw new Error("user not found");
    }

    revalidatePath("/", "layout");

    return toFormState(
      "SUCCESS",
      "success",
      JSON.parse(JSON.stringify(userUpdate?.toObject()))
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
      throw new Error("UnAuthorised");
    }

    const withdrawalAmount = z
      .number({ coerce: true })
      .parse(formData.get("amount"));

    if (withdrawalAmount > user.walletBalance) {
      throw new Error("withdrawal amount is greater than wallet balance");
    }

    const db = await connectDB();
    const userModel = db.models.User as Model<UserDocument>;
    const transactionModel = db.models
      .Transaction as Model<TransactionDocument>;

    const userUpdate = await userModel.findByIdAndUpdate(
      user._id,
      { walletBalance: user.walletBalance - withdrawalAmount },
      { new: true }
    );

    if (!userUpdate) {
      throw new Error("user not found");
    }

    await transactionModel.create({
      userId: user._id,
      amount: -withdrawalAmount,
      status: TRANSACTION_STATUS.SUCCESS,
      type: TRANSACTION_TYPE.WITHDRAWAL,
    });

    revalidatePath("/", "layout");

    return toFormState(
      "SUCCESS",
      "success",
      JSON.parse(JSON.stringify(userUpdate?.toObject()))
    );
  } catch (error: any) {
    return fromErrorToFormState(error);
  }
}
