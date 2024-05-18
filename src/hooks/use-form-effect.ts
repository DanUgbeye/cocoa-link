import { FormState } from "@/types/form.types";
import { useEffect, useRef } from "react";

export function useFormEffect(
  formState: FormState,
  onStateChange: (formState: FormState) => void
) {
  const prevTimestamp = useRef(formState.timestamp);

  const showToast =
    formState.message && formState.timestamp !== prevTimestamp.current;

  useEffect(() => {
    if (showToast) {
      prevTimestamp.current = formState.timestamp;
      onStateChange(formState);
    }
  }, [formState, showToast]);
}
