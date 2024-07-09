import { PropsWithChildren } from "react";
import { StoreInitialState } from ".";
import ClientStoreProvider from "./client-provider";

async function getInitialState(): Promise<StoreInitialState> {
  try {
    return { transactions: [] };
  } catch (error: any) {
    return { transactions: [] };
  }
}

interface Props extends PropsWithChildren {}

export default async function StoreProvider(props: Props) {
  const { children } = props;
  const initialState = await getInitialState();

  return (
    <ClientStoreProvider initialState={initialState}>
      {children}
    </ClientStoreProvider>
  );
}
