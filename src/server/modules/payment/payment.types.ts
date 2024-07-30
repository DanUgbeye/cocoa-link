import { Payment } from "@/types/payment.types";
import { Document } from "mongoose";

export interface PaymentDocument
  extends Document<string, {}, Omit<Payment, "_id">> {}
