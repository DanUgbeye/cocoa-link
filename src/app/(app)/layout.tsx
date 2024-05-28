import Navbar from "@/components/navbar";
import { SideNav } from "@/components/sidenav";
import { cn } from "@/lib/utils";
import { getLoggedInUser } from "@/server/modules/auth/auth.actions";
import { PropsWithChildren } from "react";

export default async function AppLayout({ children }: PropsWithChildren) {
  const user = await getLoggedInUser();

  return (
    <section>
      <section className={cn(" h-full min-h-dvh w-full max-w-[100dvw] ")}>
        <SideNav user={user} className=" bg-blue-900 " />

        <section className={cn(" lg:ml-sidenav flex min-h-[100vh] flex-col ")}>
          <Navbar user={user} />
          
          <section className=" min-h-[calc(100dvh-10rem)] ">{children}</section>
        </section>
      </section>
    </section>
  );
}
