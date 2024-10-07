import { User } from "./user.types";

export type Metric = {
  _id: string;
  userId: string;

  // FARMER
  totalQuantitySold: number;
  totalQuantityProduced: number;
  totalAmountSold: number;

  // INDUSTRY
  totalQuantityPurchased: number;
  totalAmountSpent: number;
  totalAmountDeposited: number;

  totalAmountWithdrawn: number;

  createdAt: Date;
  updatedAt: Date;
};

export type MetricsWithUser = Omit<Metric, "userId"> & {
  userId: User;
};
