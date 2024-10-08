import { Deal, FullDeal } from "./deal.types";

export enum OrderStatus {
  Pending = "Pending",
  Delivered = "Delivered",
  Completed = "Completed",
  Cancelled = "Cancelled",
}

export type Order = {
  _id: string;
  dealId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  status: OrderStatus;
  location: string;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateOrder = Pick<Order, "dealId" | "location">;

export type OrderWithDeal = Omit<Order, "dealId"> & {
  dealId: Deal;
};
export type OrderWithFullDeal = Omit<Order, "dealId"> & {
  dealId: FullDeal;
};
