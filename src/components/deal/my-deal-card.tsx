"use client";

import DealStatusCard from "@/components/deal/deal-status";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { DealStatus, FullDeal } from "@/types";
import { Pencil, Trash2 } from "lucide-react";

interface Props {
  deal: FullDeal;
  loading?: { delete?: boolean };
  onEdit?: (deal: FullDeal) => any;
  onDelete?: (deal: FullDeal) => any;
}

export function MyDealCard(props: Props) {
  const { deal, loading, onDelete, onEdit } = props;

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

        <div className="flex items-center justify-end gap-2 py-2">
          <Button
            className="size-8 bg-blue-600 p-1 hover:bg-blue-700"
            onClick={() => onEdit?.(deal)}
            disabled={deal.status !== DealStatus.Pending}
          >
            <Pencil className="size-4" />
          </Button>

          <Button
            variant="destructive"
            className="size-8 p-1"
            onClick={() => onDelete?.(deal)}
            disabled={deal.status !== DealStatus.Pending || loading?.delete}
          >
            {!loading?.delete ? (
              <Trash2 className="size-4" />
            ) : (
              <Spinner className="size-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
