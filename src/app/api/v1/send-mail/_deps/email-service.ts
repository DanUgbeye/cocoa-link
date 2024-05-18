import { SERVER_CONFIG } from "@/server/config/server.config";
import { ServerException } from "@/server/utils/http-exceptions";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: SERVER_CONFIG.EMAIL_SERVICE_EMAIL,
    pass: SERVER_CONFIG.EMAIL_SERVICE_PASSWORD,
  },
});

export type EmailData = {
  from: string;
  to: string;
  subject: string;
  text?: string;
};

export async function sendEmail(data: EmailData) {
  try {
    await transporter.sendMail(data);
    return true;
  } catch (error: any) {
    throw new ServerException(error.message);
  }
}
