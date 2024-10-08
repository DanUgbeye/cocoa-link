import { Upload } from "@/types";
import { Document, ObjectId } from "mongoose";

export interface UploadDocument
  extends Document,
    Omit<Upload, "_id" | "userId"> {
  _id: ObjectId;
  userId: ObjectId;
}
