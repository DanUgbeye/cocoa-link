"use client";

import { PAGES } from "@/data/page-map";
import useWindowSize from "@/hooks/use-window-size.hook";
import { usePathname } from "next/navigation";
import React, { useMemo } from "react";
import {
  BREAK_POINT_NAME,
  BreakpointName,
  DEFAULT_BREAK_POINT,
  SideNavButtonData,
  SideNavLinkData,
} from "@/types/sidenav.types";
import SideNavLink, { SideNavButton, SideNavLinkGroup } from "../sidenav-link";
import { SideNavWrapperProps } from "../sidenav-wrapper";
import { DesktopSideNav, MobileSideNav } from "./variants";
import { User, USER_ROLES } from "@/types";
import {
  INDUSTRY_SIDENAV_LINKS,
  FARMER_SIDENAV_LINKS,
} from "./sidenav-link-data";

export interface BaseSideNavProps extends SideNavWrapperProps {}

export interface SideNavProps extends BaseSideNavProps {
  user?: User;
  breakpoint?: number;
}

export function SideNav(props: SideNavProps) {
  const { breakpoint = DEFAULT_BREAK_POINT, children, user, ...rest } = props;
  const pathname = usePathname();
  const { width } = useWindowSize();
  const sideNavLinks = useMemo(() => {
    if (!user) return [];

    if (user.role === USER_ROLES.INDUSTRY) {
      return INDUSTRY_SIDENAV_LINKS;
    }

    return FARMER_SIDENAV_LINKS;
  }, [user]);

  const activeTab = useMemo(() => {
    if (pathname === PAGES.DASHBOARD) {
      return PAGES.DASHBOARD;
    }

    const pageUrls = Object.values(PAGES).filter(
      (url) => url !== PAGES.DASHBOARD
    );

    for (const pageUrl of pageUrls) {
      if (pathname.startsWith(pageUrl)) {
        return pageUrl;
      }
    }
  }, [pathname]);

  const currentBreakPoint = React.useMemo<BreakpointName>(() => {
    if (breakpoint && width > breakpoint) {
      return BREAK_POINT_NAME.DESKTOP;
    } else return BREAK_POINT_NAME.MOBILE;
  }, [width, breakpoint]);

  const navLinks = React.useMemo(() => {
    return (
      <div className=" pt-4 ">
        <div className=" space-y-4 ">
          {sideNavLinks.map((item) => {
            const { groupName, links } = item;

            return (
              <SideNavLinkGroup
                key={`sidenav-group-${groupName}`}
                groupTitle={groupName}
              >
                {[...links].map((item, subIndex) => {
                  const { icon: Icon, name, navType, ...rest } = item;

                  if (!navType || navType === "Link") {
                    return (
                      <SideNavLink
                        key={`${groupName}-link-${name}-${subIndex}`}
                        {...(rest as SideNavLinkData)}
                        active={(rest as SideNavLinkData).href === activeTab}
                        icon={<Icon className=" size-5 " />}
                      >
                        {name}
                      </SideNavLink>
                    );
                  } else {
                    return (
                      <SideNavButton
                        key={`${groupName}-link-${name}-${subIndex}`}
                        {...(rest as SideNavButtonData)}
                        icon={<Icon className=" size-5 " />}
                      >
                        {name}
                      </SideNavButton>
                    );
                  }
                })}
              </SideNavLinkGroup>
            );
          })}
        </div>
      </div>
    );
  }, [sideNavLinks, activeTab]);

  return (
    <>
      {currentBreakPoint === BREAK_POINT_NAME.DESKTOP && (
        <DesktopSideNav {...rest}>{navLinks}</DesktopSideNav>
      )}

      {currentBreakPoint === BREAK_POINT_NAME.MOBILE && (
        <MobileSideNav {...rest}>{navLinks}</MobileSideNav>
      )}
    </>
  );
}
