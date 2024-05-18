import { Container } from "@/components/container";
import React from "react";

export default function DashboardPage() {
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
