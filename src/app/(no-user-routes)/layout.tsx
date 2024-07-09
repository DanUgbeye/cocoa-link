import { COOKIE_KEYS } from "@/data/keys";
import { PAGES } from "@/data/page-map";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

export default async function Layout({ children }: PropsWithChildren) {
  const userExists = cookies().get(COOKIE_KEYS.AUTH);

  if (userExists) {
    redirect(PAGES.DASHBOARD);
  }

  return children;
}
