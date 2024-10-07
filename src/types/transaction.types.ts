export enum TransactionStatus {
  Success = "Success",
  Pending = "Pending",
  Failed = "Failed",
}

export enum TransactionType {
  Purchase = "Purchase",
  Refund = "Refund",
  Sale = "Sale",
  Withdrawal = "Withdrawal",
  Deposit = "Deposit",
}

export type Transaction = {
  _id: string;
  userId: string;
  orderId?: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateTransaction = Omit<
  Transaction,
  "_id" | "status" | "createdAt" | "updatedAt"
> & {
  type?: TransactionType;
};
