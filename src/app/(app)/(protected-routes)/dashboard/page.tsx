import { Container } from "@/components/container";
import { PAGES } from "@/data/page-map";
import { getLoggedInUser } from "@/server/modules/auth/auth.actions";
import { redirect } from "next/navigation";
import React from "react";

export default async function DashboardPage() {
  const user = await getLoggedInUser()
  if(!user) redirect(PAGES.HOME);

  // TODO fetch assets
  // TODO check user and admin role and display data

  try {
    return (
      <main className=" py-10">
        <Container>Welcome to Famis</Container>
      </main>
    );
  } catch (error: any) {
    return <main>{error.message}</main>;
  }
}


