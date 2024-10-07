import { FormState } from "@/types/form.types";
import { useEffect, useRef } from "react";

export function useFormEffect<TData>(
  formState: FormState<TData>,
  onStateChange: (formState: FormState<TData>) => void
) {
  const prevTimestamp = useRef(formState.timestamp);

  const allowAction =
    formState.message && formState.timestamp !== prevTimestamp.current;

  useEffect(() => {
    if (allowAction) {
      prevTimestamp.current = formState.timestamp;
      onStateChange(formState);
    }
  }, [formState, allowAction, onStateChange]);
}
