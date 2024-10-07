import { Deal } from "@/types";
import { Document, ObjectId } from "mongoose";

export interface DealDocument extends Omit<Deal, "_id" | "dealer">, Document {
  _id: ObjectId;
  dealer: ObjectId;
}
