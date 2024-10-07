import { TransactionStatus, TransactionType } from "@/types";
import { z } from "zod";

export const TransactionTypeSchema = z.enum([
  TransactionType.Deposit,
  TransactionType.Purchase,
  TransactionType.Withdrawal,
  TransactionType.Refund,
  TransactionType.Sale,
]);

export const TransactionStatusSchema = z.enum([
  TransactionStatus.Failed,
  TransactionStatus.Pending,
  TransactionStatus.Success,
]);
