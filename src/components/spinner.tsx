import React, { HTMLAttributes } from "react";
import { CgSpinnerTwoAlt } from "react-icons/cg";
import { twMerge } from "tailwind-merge";

export interface SpinnerProps extends HTMLAttributes<HTMLOrSVGElement> {}

export default function Spinner(props: SpinnerProps) {
  const { className, ...rest } = props;

  return (
    <CgSpinnerTwoAlt
      className={twMerge("size-6 animate-spin duration-700", className)}
      {...rest}
    />
  );
}
