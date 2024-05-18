export interface ServerConfig {
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
  MONGO_DB_URL: string;
  TOKEN_SECRET: string;
  EMAIL_SERVICE_EMAIL: string;
  EMAIL_SERVICE_PASSWORD: string;
}

export const SERVER_CONFIG: ServerConfig = {
  ADMIN_EMAIL: process.env.ADMIN_EMAIL as string,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD as string,
  MONGO_DB_URL: process.env.MONGO_DB_URL as string,
  TOKEN_SECRET: process.env.TOKEN_SECRET as string,
  EMAIL_SERVICE_EMAIL: process.env.EMAIL_SERVICE_EMAIL as string,
  EMAIL_SERVICE_PASSWORD: process.env.EMAIL_SERVICE_PASSWORD as string,
};
