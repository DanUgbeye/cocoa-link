import { z } from "zod";

export const CreateAssetSchema = z.object({
  name: z.string(),
  description: z.string(),
  currentLocation: z.string(),
  acquisitionDate: z.coerce.date(),
  depreciationRate: z.number({ coerce: true }),
  purchaseCost: z.number({ coerce: true }),
  status: z
    .union([z.null(), z.enum(["Active", "Damaged", "Sold"])])
    .default("Active"),
});
