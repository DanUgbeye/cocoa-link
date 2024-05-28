import { Asset } from "./asset.types";
import { User } from "./user.types";

export type Application = {
  _id: string;
  asset: string;
  from: string;
  to: string;
  reason: string;
  approved: boolean;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type FullApplication = {
  _id: string;
  asset: Asset;
  from: User;
  to: User;
  reason: string;
  approved: boolean;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};
