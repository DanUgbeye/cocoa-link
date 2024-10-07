import { Order } from "@/types/order.types";
import { Document, ObjectId } from "mongoose";

export interface OrderDocument
  extends Document,
    Omit<Order, "_id" | "dealId" | "buyerId" | "sellerId"> {
  _id: ObjectId;
  dealId: ObjectId;
  buyerId: ObjectId;
  sellerId: ObjectId;
}
