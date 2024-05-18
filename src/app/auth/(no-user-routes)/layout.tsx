import { COOKIE_KEYS } from "@/data/keys";
import { PAGES } from "@/data/page-map";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

async function verifyNoUser() {
  "use server";
  const userExists = cookies().get(COOKIE_KEYS.AUTH);
  if (userExists) {
    redirect(PAGES.DASHBOARD);
  }
}

export default async function Layout({ children }: PropsWithChildren) {
  await verifyNoUser();

  return children;
}
