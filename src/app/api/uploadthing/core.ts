import { COOKIE_KEYS } from "@/data/keys";
import { SERVER_CONFIG } from "@/server/config/server.config";
import connectDB from "@/server/db/connect";
import { UploadDocument } from "@/server/modules/upload/upload.types";
import { tokenUtil } from "@/server/utils/token";
import { Upload, UserRole } from "@/types";
import { AuthTokenPayloadSchema } from "@/validation";
import { Model } from "mongoose";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const fileUploadRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  cocoaImageUploader: f({ image: { maxFileSize: "16MB", maxFileCount: 1 } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req, files }) => {
      if (files.length <= 0) {
        throw new UploadThingError("File is required");
      }

      if (!files[0]?.type.includes("image")) {
        throw new UploadThingError("Only images are allowed");
      }

      // This code runs on your server before upload
      const authCookie = req.cookies.get(COOKIE_KEYS.AUTH);
      if (!authCookie || !authCookie.value) {
        throw new UploadThingError("Unauthorized");
      }

      const authToken = authCookie.value;
      const authPayload = tokenUtil.verifyJwtToken(authToken);
      const validation =
        await AuthTokenPayloadSchema.safeParseAsync(authPayload);

      // ensure that only farmers can upload files
      if (validation.error || validation.data.role !== UserRole.Farmer) {
        throw new UploadThingError("Unauthorized");
      }

      return { userId: validation.data.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const db = await connectDB();
      const uploadModel: Model<UploadDocument> = db.models.Upload;

      const { appUrl, name, key, size, type, url } = file;
      const upload = await uploadModel.create({
        appUrl,
        url,
        key,
        name,
        size,
        type,
        userId: metadata.userId,
      });

      return { metadata, fileId: String(upload._id) };
    }),
} satisfies FileRouter;

export type FileUploadRouter = typeof fileUploadRouter;

export const utAPI = new UTApi({
  token: SERVER_CONFIG.UPLOADTHING_TOKEN,
});
