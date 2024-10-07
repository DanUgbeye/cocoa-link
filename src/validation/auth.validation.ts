import { UserRoleSchema } from "@/server/modules/user/user.validation";
import { AuthTokenPayload } from "@/types";
import { ZodType, z } from "zod";

export const AuthTokenPayloadSchema = z.object({
  id: z.string(),
  role: UserRoleSchema,
}) satisfies ZodType<AuthTokenPayload>;
