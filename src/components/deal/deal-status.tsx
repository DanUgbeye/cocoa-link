import { cn } from "@/lib/utils";
import { DealStatus } from "@/types";
import React, { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  status: DealStatus;
}

export default function DealStatusCard(props: Props) {
  const { status, className, ...rest } = props;

  return (
    <div
      {...rest}
      className={cn(
        "rounded border px-2 py-1 text-xs",
        {
          "border-amber-600 bg-amber-100 text-amber-600":
            status === DealStatus.Sold,
          "border-green-700 bg-green-100 text-green-700":
            status === DealStatus.Pending,
        },
        className
      )}
    >
      {status === DealStatus.Pending ? "Available" : status}
    </div>
  );
}
