import { z } from "zod";

export const CreateApplicationSchema = z.object({
  asset: z.string(),
  from: z.string(),
  to: z.string(),
  reason: z.string().nullish(),
});
