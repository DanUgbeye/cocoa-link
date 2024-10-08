import { createRouteHandler } from "uploadthing/next";
import { fileUploadRouter } from "./core";
import { SERVER_CONFIG } from "@/server/config/server.config";

export const { GET, POST } = createRouteHandler({
  router: fileUploadRouter,
  config: {
    token: SERVER_CONFIG.UPLOADTHING_TOKEN,
    callbackUrl: `${SERVER_CONFIG.BASE_URL}/api/uploadthing`,
  },
});
