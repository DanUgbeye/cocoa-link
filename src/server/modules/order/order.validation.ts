import { CreateOrder, Order } from "@/types";
import { z, ZodType } from "zod";

export const CreateOrderSchema = z.object({
  buyerId: z.string().min(1, "buyerId is required"),
  sellerId: z.string().min(1, "buyerId is required"),
  quantity: z.number({ coerce: true }),
  amount: z.number({ coerce: true }),
  location: z.string(),
}) satisfies ZodType<CreateOrder>;
