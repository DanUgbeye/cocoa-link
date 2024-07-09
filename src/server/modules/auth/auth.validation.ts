import { ZodType, z } from "zod";
import { AuthTokenPayload } from "./auth.types";
import { USER_ROLES } from "@/types";

export const AuthTokenPayloadSchema = z.object({
  id: z.string(),
  role: z.enum([USER_ROLES.FARMER, USER_ROLES.INDUSTRY]),
}) satisfies ZodType<AuthTokenPayload>;
