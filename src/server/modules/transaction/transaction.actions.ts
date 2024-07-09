"use server";

import { PAGES } from "@/data/page-map";
import { fromErrorToFormState } from "@/lib/utils";
import connectDB from "@/server/db/connect";
import { FormState } from "@/types/form.types";
import { Transaction } from "@/types/transaction.types";
import { Model } from "mongoose";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getLoggedInUser } from "../auth/auth.actions";
import { TransactionDocument } from "./transaction.types";
import { CreateTransactionSchema } from "./transaction.validation";

export async function getUserTransactions(userId: string) {
  try {
    const db = await connectDB();
    const transactionModel = db.models
      .Transaction as Model<TransactionDocument>;

    return JSON.parse(
      JSON.stringify(await transactionModel.find({ userId }))
    ) as Transaction[];
  } catch (error: any) {
    return [];
  }
}

export async function getTransaction(transactionId: string) {
  try {
    const db = await connectDB();
    const transactionModel = db.models
      .Transaction as Model<TransactionDocument>;

    return JSON.parse(
      JSON.stringify(await transactionModel.findOne({ _id: transactionId }))
    ) as Transaction;
  } catch (error: any) {
    return undefined;
  }
}

export async function createTransaction(
  formState: FormState,
  formData: FormData
) {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      throw new Error("Unauthorised");
    }
    console.log(JSON.stringify(formData.entries(), null, 2), "formData");

    let validData = CreateTransactionSchema.parse({
      name: formData.get("name"),
      buyerId: formData.get("buyerId"),
      sellerId: formData.get("sellerId"),
      quantity: formData.get("quantity"),
      amount: formData.get("amount"),
      type: formData.get("type"),
    });

    const db = await connectDB();
    const transactionModel = db.models
      .Transaction as Model<TransactionDocument>;

    const transaction = await transactionModel.create({
      ...validData,
      userId: user._id,
    });

    revalidatePath(PAGES.DASHBOARD);

    return {
      status: "SUCCESS",
      message: "transaction created",
      data: JSON.parse(JSON.stringify(transaction)) as Transaction,
      timestamp: new Date().getTime(),
    } satisfies FormState<Transaction>;
  } catch (error: any) {
    console.log(error);
    return fromErrorToFormState(error);
  }
}

export async function cancelTransaction(
  formState: FormState,
  formData: FormData
) {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      throw new Error("Unauthorised");
    }

    let transactionId = z.string().parse(formData.get("transactionId"));

    const db = await connectDB();
    const transactionModel = db.models
      .Transaction as Model<TransactionDocument>;

    const transaction = (await transactionModel.findOne({
      _id: transactionId,
    })) as Transaction | null;

    if (
      !transaction ||
      (transaction.sellerId !== user._id && transaction.buyerId !== user._id)
    ) {
      throw new Error("transaction not found");
    }

    await transactionModel.deleteOne({ _id: transactionId });

    revalidatePath(PAGES.DASHBOARD);

    return {
      status: "SUCCESS",
      message: "transaction cancelled",
      timestamp: new Date().getTime(),
    } satisfies FormState;
  } catch (error: any) {
    return fromErrorToFormState(error);
  }
}
