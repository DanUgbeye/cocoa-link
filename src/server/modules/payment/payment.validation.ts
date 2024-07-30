import { CreatePayment, Payment } from "@/types";
import { z, ZodType } from "zod";

export const CreatePaymentSchema = z.object({
  buyerId: z.string(),
  sellerId: z.string(),
  quantity: z.number({ coerce: true }),
  amount: z.number({ coerce: true }),
}) satisfies ZodType<CreatePayment>;
