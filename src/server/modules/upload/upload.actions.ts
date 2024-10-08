"use server";

import connectDB from "@/server/db/connect";
import { Upload } from "@/types";
import { Model } from "mongoose";
import { UploadDocument } from "./upload.types";
import HttpException from "@/server/utils/http-exceptions";
import { uploadthingAPI } from "@/server/config/uploadthing";

export async function getUserUploads(userId: string) {
  try {
    const db = await connectDB();
    const uploadModel = db.models.Upload as Model<UploadDocument>;

    return JSON.parse(
      JSON.stringify(await uploadModel.find({ userId }))
    ) as Upload[];
  } catch (error: any) {
    return [];
  }
}

export async function getUpload(uploadId: string) {
  try {
    const db = await connectDB();
    const uploadModel = db.models.Upload as Model<UploadDocument>;

    return JSON.parse(
      JSON.stringify(await uploadModel.findById(uploadId))
    ) as Upload;
  } catch (error: any) {
    return undefined;
  }
}

export async function deleteUpload(uploadId: string) {
  try {
    const db = await connectDB();
    const uploadModel = db.models.Upload as Model<UploadDocument>;

    const upload = await uploadModel.findById(uploadId);

    if (!upload) {
      throw new HttpException("Upload not found", 404);
    }

    await uploadthingAPI.deleteFiles(upload.key);
    return true;
  } catch (error: any) {
    throw new HttpException(error.message, error.status || 500);
  }
}
