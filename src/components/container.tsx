"use client";
import React from "react";
import { twMerge } from "tailwind-merge";

export interface ContainerProps
  extends React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    >,
    React.PropsWithChildren {}

export function Container(props: ContainerProps) {
  const { className, children, ...restProps } = props;

  return (
    <center
      className={twMerge(
        " mx-auto flex h-full w-full max-w-[100rem] flex-col px-8 sm:px-[5%] xl:px-[6rem] ",
        className || ""
      )}
      {...restProps}
    >
      {children}
    </center>
  );
}
