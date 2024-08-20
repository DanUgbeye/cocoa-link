import { PAGES } from "@/data/page-map";
import { SideNavLinkGroupData } from "@/types/sidenav.types";
import { CircleDollarSign, Globe, Handshake, Home } from "lucide-react";

export const INDUSTRY_SIDENAV_LINKS: SideNavLinkGroupData[] = [
  {
    groupName: "",
    links: [
      {
        name: "Dashboard",
        href: PAGES.DASHBOARD,
        icon: Home,
      },
      {
        name: "Marketplace",
        href: PAGES.MARKET,
        icon: Globe,
      },
      {
        name: "Orders",
        href: PAGES.ORDERS,
        icon: Handshake,
      },
      {
        name: "Transactions",
        href: PAGES.TRANSACTIONS,
        icon: CircleDollarSign,
      },
    ],
  },
] as const;

export const FARMER_SIDENAV_LINKS: SideNavLinkGroupData[] = [
  {
    groupName: "",
    links: [
      {
        name: "Dashboard",
        href: PAGES.DASHBOARD,
        icon: Home,
      },
      {
        name: "Orders",
        href: PAGES.ORDERS,
        icon: Handshake,
      },
      {
        name: "Transactions",
        href: PAGES.TRANSACTIONS,
        icon: CircleDollarSign,
      },
    ],
  },
] as const;
