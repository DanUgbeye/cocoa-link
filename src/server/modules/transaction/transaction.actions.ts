"use server";

import connectDB from "@/server/db/connect";
import { Transaction } from "@/types/transaction.types";
import { Model } from "mongoose";
import { TransactionDocument } from "./transaction.types";

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
