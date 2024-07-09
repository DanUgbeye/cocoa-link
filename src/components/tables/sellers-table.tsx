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

export default function SellersTable(props: { items: CocoaStoreWithUser[] }) {
  const { items } = props;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Seller</TableHead>

          <TableHead className="hidden text-center sm:table-cell">
            Quantity
          </TableHead>

          <TableHead className="hidden text-center sm:table-cell">
            Amount
          </TableHead>

          <TableHead className="text-center"></TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {items.map((item, index) => {
          return (
            <TableRow
              key={item._id}
              className={cn("bg-accent", {
                " pointer-events-none opacity-50 ": item.quantity === 0,
              })}
            >
              <TableCell>
                <div className="font-medium">{item.user.name}</div>

                <div className="text-muted-foreground line-clamp-3 hidden text-xs text-neutral-500 md:inline">
                  {item.user.email}
                </div>
              </TableCell>

              <TableCell>
                <div className="font-medium">{item.quantity}</div>

                <div className="text-muted-foreground line-clamp-3 hidden text-xs text-neutral-500 md:inline">
                  {Number(item.pricePerItem).toLocaleString(undefined, {
                    style: "currency",
                    currency: "NGN",
                  })}
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

              <TableCell className="text-right">
                {/* TODO BUY button */}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
