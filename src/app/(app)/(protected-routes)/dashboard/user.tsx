import { Container } from "@/components/container";
import { getUserAssets } from "@/server/modules/asset/asset.actions";
import React from "react";

export default async function UserDashboardPage(props: { userId: string }) {
  const { userId } = props;
  const userAssets = await getUserAssets(userId);
  // TODO fetch assets for user

  return (
    <main className=" py-10 ">
      <Container>UserDashboardPage</Container>
      <div className="  ">{JSON.stringify(userAssets)}</div>
    </main>
  );
}
