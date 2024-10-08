import { UserLoginData, UserRole } from "@/types";
import { ZodType, z } from "zod";

export const UserRoleSchema = z.enum([
  UserRole.Farmer,
  UserRole.Industry,
]) satisfies ZodType<UserRole>;

export const UserLoginSchema = z.object({
  email: z.string().toLowerCase().min(1, "email is required").email(),
  password: z.string().min(1, "password is required").min(8).max(16),
}) satisfies ZodType<UserLoginData>;

export const UserSignupSchema = z.object({
  name: z.string().min(2, "name must be at least 2 characters"),
  email: z.string().toLowerCase().min(1, "email is required").email(),
  password: z.string().min(1, "password is required").min(8).max(16),
  role: UserRoleSchema.default(UserRole.Farmer),
}) satisfies ZodType<UserLoginData>;
