import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { PAGES } from "@/data/page-map";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { HTMLAttributes } from "react";

export interface SideNavWrapperProps extends HTMLAttributes<HTMLElement> {}

const SideNavWrapper = React.forwardRef<HTMLElement, SideNavWrapperProps>(
  (props, ref) => {
    const { children, className, ...rest } = props;

    return (
      <aside
        {...rest}
        ref={ref}
        className={cn("h-dvh w-sidenav flex-col", className)}
      >
        <div className="flex h-[5rem] w-full items-center">
          <Link
            href={PAGES.LOGIN}
            className="w-full px-6 text-lg font-semibold text-white sm:text-2xl"
          >
            COCOA LINK
          </Link>
        </div>

        <Separator />

        <ScrollArea style={{ height: `calc(100dvh - 5rem)` }}>
          {children}
        </ScrollArea>
      </aside>
    );
  }
);
SideNavWrapper.displayName = "SideNavWrapper";

export default SideNavWrapper;
