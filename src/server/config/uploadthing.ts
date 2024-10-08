import "server-only";

import { SERVER_CONFIG } from "@/server/config/server.config";
import { UTApi } from "uploadthing/server";

export const uploadthingAPI = new UTApi({
  token: SERVER_CONFIG.UPLOADTHING_TOKEN,
});
