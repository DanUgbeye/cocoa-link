import { NextRequest } from "next/server";
import { EmailData, sendEmail } from "./_deps/email-service";
import ServerResponse from "@/server/utils/response";

async function handleSendEmail(req: NextRequest) {
  try {
    const emailData = (await req.json()) as EmailData;

    await sendEmail(emailData);
    return ServerResponse.success("Email sent", 200);
  } catch (error: any) {
    return ServerResponse.error(error);
  }
}

export { handleSendEmail as POST };
