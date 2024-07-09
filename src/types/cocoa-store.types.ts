import { User } from "./user.types";

export type CocoaStore = {
  _id: string;
  user: string;
  quantity: number;
  pricePerItem: number;
  totalSold: number;
  totalQuantity: number;
  totalAmountSold: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CocoaStoreWithUser = Omit<CocoaStore, "user"> & {
  user: User;
};
