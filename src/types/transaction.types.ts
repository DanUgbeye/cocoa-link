export const TRANSACTION_STATUS = {
  PENDING: "Pending",
  SUCCESS: "Success",
  FAILED: "Failed",
} as const;
export type TransactionStatus =
  (typeof TRANSACTION_STATUS)[keyof typeof TRANSACTION_STATUS];

export const TRANSACTION_TYPE = {
  PURCHASE: "Purchase",
  REFUND: "Refund",
  SALE: "Sale",
  WITHDRAWAL: "Withdrawal",
  DEPOSIT: "Deposit",
} as const;
export type TransactionType =
  (typeof TRANSACTION_TYPE)[keyof typeof TRANSACTION_TYPE];

export type Transaction = {
  _id: string;
  userId: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateTransaction = Omit<
  Transaction,
  "_id" | "status" | "createdAt" | "updatedAt" | "status" | "type"
> & {
  type?: TransactionType;
};
