import { Container } from "@/components/container";
import { getAllAssets } from "@/server/modules/asset/asset.actions";
import React from "react";

export default async function AdminDashboardPage(props: { userId: string }) {
  const { userId } = props;
  const assets = await getAllAssets();
  // TODO fetch assets

  return (
    <main className=" py-10 ">
      <Container>Admin DashboardPage</Container>
      <div className="  ">{JSON.stringify(assets)}</div>
    </main>
  );
}
