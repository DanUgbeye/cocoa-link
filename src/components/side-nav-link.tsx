import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import React, { HTMLAttributes } from "react";
import { Button, ButtonProps } from "./ui/button";
import { useAppStore } from "@/client/store";

export interface SideNavLinkProps
  extends LinkProps,
    Pick<HTMLAttributes<HTMLElement>, "className" | "children"> {
  icon?: React.ReactNode;
  active?: boolean;
}

export default function SideNavLink(props: SideNavLinkProps) {
  const { active, className, children, icon, href = "", ...rest } = props;
  const { toggleSideNav } = useAppStore();

  return (
    <Button
      className={cn(
        "grid h-12 grid-cols-[minmax(auto,1.5rem),1fr] items-center gap-x-2 rounded-none bg-transparent pl-6 text-sm duration-300 hover:bg-transparent",
        {
          "bg-white/30 text-white hover:bg-white/30": active,
          "text-white/80 hover:bg-white/10": !active,
        },
        className
      )}
      asChild
    >
      <Link
        href={href}
        onClick={() => {
          toggleSideNav();
        }}
        {...rest}
      >
        <span className="aspect-square h-5 w-5 self-center justify-self-center">
          {icon}
        </span>
        {children}
      </Link>
    </Button>
  );
}

export interface SideNavButtonProps extends ButtonProps {
  icon?: React.ReactNode;
}
export function SideNavButton(props: SideNavButtonProps) {
  const { className, children, icon, onClick, ...rest } = props;
  const { toggleSideNav } = useAppStore();

  return (
    <Button
      {...rest}
      onClick={(e) => {
        toggleSideNav();
        onClick && onClick(e);
      }}
      className={cn(
        "hover:bg-primary-base-100/20 grid h-11 grid-cols-[minmax(auto,1.5rem),1fr] items-center gap-x-2 rounded-none bg-transparent pl-6 text-sm text-neutral-900 duration-300",
        className
      )}
    >
      <span className="aspect-square h-5 w-5 self-center justify-self-center">
        {icon}
      </span>
      {children}
    </Button>
  );
}

export interface SideNavLinkGroupProps
  extends HTMLAttributes<HTMLUListElement> {
  groupTitle?: string;
}

export function SideNavLinkGroup(props: SideNavLinkGroupProps) {
  const { children, className, groupTitle, ...rest } = props;

  return (
    <ul {...rest} className={cn(" ", className)}>
      {groupTitle && (
        <Button
          variant={"ghost"}
          className={
            "pointer-events-none flex h-8 cursor-pointer items-center justify-start pl-6 text-xs font-medium text-neutral-300"
          }
          asChild
          disabled
        >
          <h4>{groupTitle}</h4>
        </Button>
      )}

      <div className="flex flex-col">{children}</div>
    </ul>
  );
}
