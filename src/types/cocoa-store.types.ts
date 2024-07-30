import { User } from "./user.types";

export type CocoaStore = {
  _id: string;
  userId: string;
  quantity: number;
  pricePerItem: number;
  totalQuantitySold: number;
  totalQuantityProduced: number;
  totalAmountSold: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CocoaStoreWithUser = Omit<CocoaStore, "userId"> & {
  userId: User;
};
