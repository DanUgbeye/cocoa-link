export const ACTIVITY_TYPE = {
  DAMAGE: "DAMAGE",
  REPAIR: "REPAIR",
  UPGRADE: "UPGRADE",
  MAINTENANCE: "MAINTENANCE",
  PURCHASE: "PURCHASE",
  INSPECTION: "INSPECTION",
  SALE: "SALE",
  TRANSFER: "TRANSFER",
} as const;

export type ActivityType = (typeof ACTIVITY_TYPE)[keyof typeof ACTIVITY_TYPE];

export interface Activity {
  _id: string;
  applicationId?: string;
  type: ActivityType;
  date: Date;
  amount: number;
}
