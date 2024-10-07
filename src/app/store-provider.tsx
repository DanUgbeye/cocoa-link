import {
  getUserInitialState,
  getLoggedInUser,
} from "@/server/modules/auth/auth.actions";
import { PropsWithChildren } from "react";
import ClientStoreProvider from "../client/store/provider";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { COOKIE_KEYS } from "@/data/keys";
import { PAGES } from "@/data/page-map";
import { redirect } from "next/navigation";

async function getData() {
  try {
    revalidatePath("/", "layout");
    const user = await getLoggedInUser();
    if (!user) {
      if (cookies().has(COOKIE_KEYS.AUTH)) {
        redirect(PAGES.LOGOUT);
      }

      return { transactions: [] };
    }

    return getUserInitialState(user);
  } catch (error: any) {
    return { transactions: [] };
  }
}

interface Props extends PropsWithChildren {}

export default async function StoreProvider(props: Props) {
  const { children } = props;
  const initialState = await getData();

  return (
    <ClientStoreProvider initialState={initialState}>
      {children}
    </ClientStoreProvider>
  );
}
