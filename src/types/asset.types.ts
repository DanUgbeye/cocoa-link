export type AssetStatus = "Active" | "Damaged" | "Sold";

export type Asset = {
  _id: string;
  userId: string;
  name: string;
  description: string;
  currentLocation: string;
  acquisitionDate: Date;
  depreciationRate: number;
  purchaseCost: number;
  totalExpenditure: number;
  status: AssetStatus;
};
