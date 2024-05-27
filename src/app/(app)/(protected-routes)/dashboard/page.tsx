import { Container } from "@/components/container";
import { PAGES } from "@/data/page-map";
import { getLoggedInUser } from "@/server/modules/auth/auth.actions";
import { redirect } from "next/navigation";
import React from "react";
import AdminDashboardPage from "./admin";
import UserDashboardPage from "./user";

export default async function DashboardPage() {
  const user = await getLoggedInUser();
  if (!user) redirect(PAGES.HOME);

  if (user.role === "admin") {
    return <AdminDashboardPage userId={user._id} />;
  }

  return <UserDashboardPage userId={user._id} />;
}
