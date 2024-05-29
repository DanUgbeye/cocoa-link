import { z } from "zod";

export const createActivitySchema = z.object({
  asset: z.string(),
  type: z.enum([
    "Damage",
    "Repair",
    "Upgrade",
    "Maintenance",
    "Purchase",
    "Inspection",
    "Sale",
    "Transfer",
  ]),
  date: z.coerce.date().nullable().default(new Date()),
  amount: z.number({ coerce: true }).default(0),
});
