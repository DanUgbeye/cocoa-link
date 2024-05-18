"use client";
import { appUtils } from "@/client/utils";

export interface ClientAppConfig {
  CLIENT_BASE_URL: string;
  API_BASE_URL: string;
}

function initializeClientAppConfig(): Readonly<ClientAppConfig> {
  return Object.freeze({
    CLIENT_BASE_URL: appUtils.getBaseUrl(),
    API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL as string,
  });
}

const APP_CONFIG = initializeClientAppConfig();

export default APP_CONFIG;
