"use client";

import { cn } from "@/lib/utils";
import SideNavWrapper from "../../sidenav-wrapper";
import { BaseSideNavProps } from "..";

export function DesktopSideNav(props: BaseSideNavProps) {
  const { children, className, ...rest } = props;

  return (
    <SideNavWrapper {...rest} className={cn(" fixed top-0 ", className)}>
      {children}
    </SideNavWrapper>
  );
}
