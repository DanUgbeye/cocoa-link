import { User } from "./user.types";

export enum CocoaVariant {
  Amelonado = "Amelonado",
  Criollo = "Criollo",
  Trinitario = "Trinitario",
  Hybrid = "Hybrid",
}

export enum DealStatus {
  Pending = "Pending",
  Sold = "Sold",
}

export type Deal = {
  _id: string;
  dealer: string;
  quantity: number;
  pricePerItem: number;
  variant: CocoaVariant;
  image: string;
  status: DealStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type DealWithUser = Omit<Deal, "dealer"> & {
  dealer: User;
};
