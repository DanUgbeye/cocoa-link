import { Upload } from "./upload.types";
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
  location: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type FullDeal = Omit<Deal, "image"> & {
  image: Upload;
};

export type DealWithUser = Omit<Deal, "dealer"> & {
  dealer: User;
};

export type FullDealWithUser = Omit<FullDeal, "dealer"> & {
  dealer: User;
};
