"use client";

import { useAppStore } from "@/client/store";
import { cn } from "@/lib/utils";
import { FullDealWithUser } from "@/types";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "../ui/card";

export default function DealList(props: { deals: FullDealWithUser[] }) {
  const { deals } = props;
  const { setSelectedDeal } = useAppStore();

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] gap-6">
      {deals
        .filter((tr) => tr.quantity > 0)
        .map((item, index) => {
          return (
            <Card
              key={item._id}
              className={cn(
                "bg-accent flex flex-col gap-2 rounded-lg bg-white p-4 shadow-lg"
              )}
            >
              <div className="space-y-1">
                <div className="text-xs uppercase text-neutral-400">
                  {item.dealer.role}
                </div>

                <CardHeader className="space-y-0 p-0">
                  <CardTitle className="text-lg leading-none">
                    {item.dealer.name}
                  </CardTitle>

                  <CardDescription className="text-sm leading-none">
                    {item.dealer.email}
                  </CardDescription>
                </CardHeader>
              </div>

              <CardContent className="flex flex-col gap-4 p-0">
                <div className="">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image.url}
                    alt="deal display image"
                    className="aspect-video w-full overflow-clip rounded object-cover"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="text-2xl font-semibold text-neutral-600">
                    {item.variant}
                  </div>

                  <div className="">
                    <div className="flex items-center gap-1 text-sm text-neutral-500">
                      <div className="font-medium">{item.quantity} Bags</div>

                      <span>/</span>

                      <div className="line-clamp-3 hidden md:inline">
                        {Number(item.pricePerItem).toLocaleString(undefined, {
                          style: "currency",
                          currency: "NGN",
                          notation: "compact",
                        })}{" "}
                        per bag
                      </div>
                    </div>

                    <div className="text-left text-lg font-semibold text-neutral-700">
                      {Number(item.pricePerItem * item.quantity).toLocaleString(
                        undefined,
                        {
                          style: "currency",
                          currency: "NGN",
                          maximumFractionDigits: 0,
                        }
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    {item.location && (
                      <div className="flex flex-col">
                        <span className="text-xs text-neutral-500">
                          Location
                        </span>
                        <span className="truncate text-base font-semibold">
                          {item.location}
                        </span>
                      </div>
                    )}

                    <div className="ml-auto flex justify-end">
                      <Button
                        className={
                          "h-fit bg-green-500 px-6 py-2 text-white hover:bg-green-600"
                        }
                        onClick={() => setSelectedDeal(item)}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
    </div>
  );
}
