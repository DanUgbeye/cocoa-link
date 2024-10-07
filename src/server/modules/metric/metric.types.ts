import { Metric } from "@/types";
import { Document, ObjectId } from "mongoose";

export interface MetricDocument extends Omit<Metric, "_id">, Document {
  _id: ObjectId;
}
