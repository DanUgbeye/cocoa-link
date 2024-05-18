import { FormState } from "@/types/form.types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const toFormState = (
  status: FormState["status"],
  message: string
): FormState => {
  return {
    status,
    message,
    timestamp: Date.now(),
  };
};

export function fromErrorToFormState(error: unknown): FormState {
  if (error instanceof ZodError) {
    return toFormState("ERROR", error.errors[0].message);
  } else if (error instanceof Error) {
    return toFormState("ERROR", error.message);
  } else {
    return toFormState("ERROR", "An unknown error occurred");
  }
}

