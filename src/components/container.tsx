// "use client";

import { cn } from "@/lib/utils";
import React from "react";

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    React.PropsWithChildren {}

export function Container(props: ContainerProps) {
  const { className, children, ...restProps } = props;

  return (
    <div
      className={cn(
        "mx-auto flex h-full w-full max-w-[100rem] flex-col px-5 sm:px-[5%] xl:px-[4rem]",
        className || ""
      )}
      {...restProps}
    >
      {children}
    </div>
  );
}
