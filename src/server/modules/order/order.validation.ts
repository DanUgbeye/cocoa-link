import { CreateOrder, Order } from "@/types";
import { z, ZodType } from "zod";

export const CreateOrderSchema = z.object({
  dealId: z.string(),
  location: z.string(),
}) satisfies ZodType<CreateOrder>;
