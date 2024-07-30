import { FormState } from "@/types/form.types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toFormState<TData = undefined>(
  status: FormState["status"],
  message: string,
  data?: TData
): FormState<TData> {
  return {
    status,
    message,
    data,
    timestamp: Date.now(),
  };
}

export function fromErrorToFormState(error: unknown): FormState {
  if (error instanceof ZodError) {
    return toFormState("ERROR", error.errors[0].message);
  } else if (error instanceof Error) {
    return toFormState("ERROR", error.message);
  } else {
    return toFormState("ERROR", "An unknown error occurred");
  }
}
