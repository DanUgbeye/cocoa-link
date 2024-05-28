import { z } from "zod";

export const CreateApplicationSchema = z.object({
  assetId: z.string(),
  from: z.string(),
  to: z.string(),
  reason: z.string().nullish(),
});
