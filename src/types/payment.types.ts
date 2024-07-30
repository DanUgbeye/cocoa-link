export type Payment = {
  _id: string;
  buyerId: string;
  sellerId: string;
  transactionId: string;
  quantity: number;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CreatePayment = Omit<
  Payment,
  "_id" | "transactionId" | "createdAt" | "updatedAt"
>;
