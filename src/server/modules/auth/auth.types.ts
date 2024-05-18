import { UserRole } from "@/types";

export type AuthTokenPayload = {
  id: string;
  role: UserRole;
};
