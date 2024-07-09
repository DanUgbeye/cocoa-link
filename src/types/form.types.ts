export type FormState<TData = undefined> = {
  status: "UNSET" | "SUCCESS" | "ERROR";
  message: string;
  data?: TData;
  fieldErrors?: Record<string, string[] | undefined>;
  timestamp: number;
};
