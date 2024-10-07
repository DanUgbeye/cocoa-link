"use client";

import { useAppStore } from "@/client/store";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { BaseSideNavProps } from "..";
import SideNavWrapper from "../../side-nav-wrapper";

export function MobileSideNav(props: BaseSideNavProps) {
  const { children, className, ...rest } = props;
  const { sideNavOpen, toggleSideNav } = useAppStore();

  return (
    <Sheet open={sideNavOpen} onOpenChange={(state) => toggleSideNav(state)}>
      <SheetContent
        side={"left"}
        className={cn("flex w-80 min-w-fit p-0 text-white")}
      >
        <SheetDescription hidden />
        <SheetTitle hidden />

        <SideNavWrapper {...rest} className={cn("min-w-full", className)}>
          {children}
        </SideNavWrapper>
      </SheetContent>
    </Sheet>
  );
}
