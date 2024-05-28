import {
  SideNavButtonProps,
  SideNavLinkProps,
} from "@/components/sidenav-link";
import { HTMLAttributes } from "react";

export type SideNavLinkData = {
  navType?: "Link";
  href: string;
} & Omit<SideNavLinkProps, "icon">;

export type SideNavButtonData = {
  navType: "Button";
} & Omit<SideNavButtonProps, "icon">;

export type SideNavLinkGroupData = {
  groupName: string;
  links: ({
    name: string;
    icon: React.ComponentType<HTMLAttributes<SVGSVGElement>>;
  } & (SideNavLinkData | SideNavButtonData))[];
};

export const BREAK_POINT_NAME = {
  DESKTOP: "desktop",
  MOBILE: "mobile",
} as const;

export type BreakpointName =
  (typeof BREAK_POINT_NAME)[keyof typeof BREAK_POINT_NAME];

export type BreakPoints = { [P in BreakpointName]?: number };

export const DEFAULT_BREAK_POINT = 1024;
