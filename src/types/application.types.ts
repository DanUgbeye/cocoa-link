export type Application = {
  _id: string;
  assetId: string;
  from: string;
  to: string;
  reason: string;
  approved: boolean;
  approvedAt?: Date;
  adminId: string;
  createdAt: Date;
};
