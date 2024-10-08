export interface ServerConfig {
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
  MONGO_DB_URL: string;
  TOKEN_SECRET: string;
  EMAIL_SERVICE_EMAIL: string;
  EMAIL_SERVICE_PASSWORD: string;
  UPLOADTHING_TOKEN: string;
  BASE_URL: string;
}

export const SERVER_CONFIG: ServerConfig = {
  ADMIN_EMAIL: process.env.ADMIN_EMAIL as string,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD as string,
  MONGO_DB_URL: process.env.MONGO_DB_URL as string,
  TOKEN_SECRET: process.env.TOKEN_SECRET as string,
  EMAIL_SERVICE_EMAIL: process.env.EMAIL_SERVICE_EMAIL as string,
  EMAIL_SERVICE_PASSWORD: process.env.EMAIL_SERVICE_PASSWORD as string,
  UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN as string,
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL as string,
};
