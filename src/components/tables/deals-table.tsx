"use client";

import { useAppStore } from "@/client/store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { DealWithUser, FullDealWithUser, MetricsWithUser } from "@/types";
import { Button } from "../ui/button";

export default function DealsTable(props: { deals: FullDealWithUser[] }) {
  const { deals } = props;
  const { setSelectedDeal } = useAppStore();

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Seller</TableHead>

            <TableHead className="">Variant</TableHead>

            <TableHead className="">Quantity</TableHead>

            <TableHead className="text-right">Amount</TableHead>

            <TableHead className=""></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {deals
            .filter((tr) => tr.quantity > 0)
            .map((item, index) => {
              return (
                <TableRow key={item._id} className={cn("bg-accent")}>
                  <TableCell>
                    <div className="font-medium">{item.dealer.name}</div>

                    <div className="text-muted-foreground line-clamp-3 hidden text-xs text-neutral-500 md:inline">
                      {item.dealer.email}
                    </div>
                  </TableCell>

                  <TableCell className="">{item.variant}</TableCell>

                  <TableCell>
                    <div className="font-medium">{item.quantity} Bags</div>

                    <div className="text-muted-foreground line-clamp-3 hidden text-xs text-neutral-500 md:inline">
                      {Number(item.pricePerItem).toLocaleString(undefined, {
                        style: "currency",
                        currency: "NGN",
                        notation: "compact",
                      })}{" "}
                      per bag
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    {Number(item.pricePerItem * item.quantity).toLocaleString(
                      undefined,
                      {
                        style: "currency",
                        currency: "NGN",
                      }
                    )}
                  </TableCell>

                  <TableCell className="">
                    <div className="flex justify-end">
                      <Button
                        className={
                          "h-fit bg-green-500 px-6 py-2 text-white hover:bg-green-600"
                        }
                        onClick={() => setSelectedDeal(item)}
                      >
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
}
