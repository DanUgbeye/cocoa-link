import Navbar from "@/components/navbar";
import { SideNav } from "@/components/sidenav";
import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

export default async function AppTemplate({ children }: PropsWithChildren) {
  return (
    <section>
      <div className={cn("h-full min-h-dvh w-full max-w-[100dvw]")}>
        <SideNav className="bg-amber-900/40" />

        <div className={cn("flex min-h-[100vh] flex-col lg:ml-sidenav")}>
          <Navbar />

          <div className="min-h-[calc(100dvh-10rem)]">{children}</div>
        </div>
      </div>
    </section>
  );
}
