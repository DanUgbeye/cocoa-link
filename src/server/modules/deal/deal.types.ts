import { Deal } from "@/types";
import { Document, ObjectId } from "mongoose";

export interface DealDocument
  extends Omit<Deal, "_id" | "dealer" | "image">,
    Document {
  _id: ObjectId;
  dealer: ObjectId;
  image: ObjectId;
}
