export const ACTIVITY_TYPE = {
  DAMAGE: "Damage",
  REPAIR: "Repair",
  UPGRADE: "Upgade",
  MAINTENANCE: "Maintenance",
  PURCHASE: "Purchase",
  INSPECTION: "Inspection",
  SALE: "Sale",
  TRANSFER: "Transfer",
} as const;

export type ActivityType = (typeof ACTIVITY_TYPE)[keyof typeof ACTIVITY_TYPE];

export interface Activity {
  _id: string;
  type: ActivityType;
  date: Date;
  amount: number;
}
