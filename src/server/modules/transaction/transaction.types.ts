import { Transaction } from "@/types/transaction.types";
import { Document, ObjectId } from "mongoose";

export interface TransactionDocument
  extends Document,
    Omit<Transaction, "_id" | "orderId" | "userId"> {
  _id: ObjectId;
  orderId: ObjectId;
  userId: ObjectId;
}
