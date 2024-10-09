"use client";

import DealStatusCard from "@/components/deal/deal-status";
import { FullDeal, FullDealWithUser } from "@/types";

interface Props {
  deal: FullDeal;
}

export function DealCard(props: Props) {
  const { deal } = props;

  return (
    <div className="overflow-clip rounded border bg-amber-700/5 text-sm duration-300">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={deal.image.url}
        alt="deal display image"
        className="aspect-video w-full overflow-clip rounded object-cover"
      />

      <div className="space-y-2 p-4">
        <div className="grid grid-cols-[1fr,auto] items-center gap-1">
          <div className="flex flex-col">
            <span className="text-xs text-neutral-400">Variant</span>
            <span className="text-base">{deal.variant}</span>
          </div>

          <div className="">
            <DealStatusCard status={deal.status} />
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-xl font-semibold">
            {Number(deal.quantity).toLocaleString()} Bags
          </span>

          <span className="text-sm">
            {Number(deal.pricePerItem).toLocaleString(undefined, {
              style: "currency",
              currency: "NGN",
              maximumFractionDigits: 0,
            })}{" "}
            per bag
          </span>
        </div>
      </div>
    </div>
  );
}
