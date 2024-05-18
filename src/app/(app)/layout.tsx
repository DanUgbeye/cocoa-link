import Navbar from "@/components/navbar";
import { getLoggedInUser } from "@/server/modules/auth/auth.actions";
import React, { PropsWithChildren } from "react";

export default async function AppLayout({ children }: PropsWithChildren) {
  const user = await getLoggedInUser();

  return (
    <section>
      <Navbar user={user} />
      <div className="  ">{children}</div>
    </section>
  );
}
