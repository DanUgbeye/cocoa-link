import { TRANSACTION_STATUS, TRANSACTION_TYPE } from "@/types";
import { z } from "zod";

export const TransactionTypeSchema = z.enum([
  TRANSACTION_TYPE.DEPOSIT,
  TRANSACTION_TYPE.PURCHASE,
  TRANSACTION_TYPE.WITHDRAWAL,
]);

export const TransactionStatusSchema = z.enum([
  TRANSACTION_STATUS.FAILED,
  TRANSACTION_STATUS.PENDING,
  TRANSACTION_STATUS.SUCCESS,
]);
