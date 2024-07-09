import { Transaction } from "@/types/transaction.types";
import { Document } from "mongoose";

export interface TransactionDocument
  extends Document<string, {}, Omit<Transaction, "_id">> {}
