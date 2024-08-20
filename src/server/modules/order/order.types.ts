import { Order } from "@/types/order.types";
import { Document } from "mongoose";

export interface OrderDocument
  extends Document<string, {}>,
    Omit<Order, "_id"> {}
