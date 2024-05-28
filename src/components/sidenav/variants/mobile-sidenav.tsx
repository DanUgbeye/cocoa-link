"use client";

import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import SideNavWrapper from "../../sidenav-wrapper";
import { BaseSideNavProps } from "..";
import { useAppStore } from "@/client/store";

export function MobileSideNav(props: BaseSideNavProps) {
  const { children, className, ...rest } = props;
  const { sidenavOpen, toggleSidenav } = useAppStore();

  return (
    <Sheet open={sidenavOpen} onOpenChange={(state) => toggleSidenav(state)}>
      <SheetContent
        side={"left"}
        className={cn(" flex w-80 min-w-fit p-0 text-white ")}
      >
        <SideNavWrapper {...rest} className={cn(" min-w-full ", className)}>
          {children}
        </SideNavWrapper>
      </SheetContent>
    </Sheet>
  );
}
