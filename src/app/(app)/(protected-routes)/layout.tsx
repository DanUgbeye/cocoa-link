import { COOKIE_KEYS } from "@/data/keys";
import { PAGES } from "@/data/page-map";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

async function ensureUserLoggedIn() {
  const isLoggedIn = cookies().get(COOKIE_KEYS.AUTH);
  if (!isLoggedIn) {
    redirect(PAGES.HOME);
  }
}

export interface LayoutProps extends React.PropsWithChildren {}

export default async function Layout(props: LayoutProps) {
  const { children } = props;
  await ensureUserLoggedIn();

  return children;
}
