export type Order = {
  _id: string;
  buyerId: string;
  sellerId: string;
  transactionId: string;
  quantity: number;
  amount: number;
  status: OrderStatus;
  location: string;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateOrder = Omit<
  Order,
  "_id" | "transactionId" | "status" | "deliveredAt" | "createdAt" | "updatedAt"
>;

export const ORDER_STATUS = {
  PENDING: "Pending",
  DELIVERED: "Delivered",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
