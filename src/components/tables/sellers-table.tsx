"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { CocoaStoreWithUser } from "@/types";
import { Button } from "../ui/button";
import { useAppStore } from "@/client/store";

export default function SellersTable(props: { items: CocoaStoreWithUser[] }) {
  const { items } = props;
  const { setSelctedDeal } = useAppStore();

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Seller</TableHead>

            <TableHead className="">Quantity</TableHead>

            <TableHead className="">Total Amount</TableHead>

            <TableHead className=""></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {items
            .filter((tr) => tr.quantity > 0)
            .map((item, index) => {
              return (
                <TableRow key={item._id} className={cn("bg-accent")}>
                  <TableCell>
                    <div className="font-medium">{item.userId.name}</div>

                    <div className="text-muted-foreground line-clamp-3 hidden text-xs text-neutral-500 md:inline">
                      {item.userId.email}
                    </div>
                  </TableCell>

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

                  <TableCell className="">
                    {Number(item.pricePerItem * item.quantity).toLocaleString(
                      undefined,
                      {
                        style: "currency",
                        currency: "NGN",
                      }
                    )}
                  </TableCell>

                  <TableCell className="">
                    <Button
                      className={
                        "h-fit bg-green-500 px-6 py-2 text-white hover:bg-green-600"
                      }
                      onClick={() => setSelctedDeal(item)}
                    >
                      Buy
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
}
