import {
  CreateTransaction,
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
} from "@/types";
import { z, ZodType } from "zod";

export const TransactionTypeSchema = z.enum([
  TRANSACTION_TYPE.DEPOSIT,
  TRANSACTION_TYPE.SALE,
  TRANSACTION_TYPE.WITHDRAWAL,
]);
export const TransactionStatusSchema = z.enum([
  TRANSACTION_STATUS.FAILED,
  TRANSACTION_STATUS.PENDING,
  TRANSACTION_STATUS.SUCCESS,
]);

export const CreateTransactionSchema = z.object({
  buyerId: z.string(),
  sellerId: z.string(),
  quantity: z.number(),
  amount: z.number(),
  type: TransactionTypeSchema.optional().default(TRANSACTION_TYPE.SALE),
}) satisfies ZodType<CreateTransaction>;
