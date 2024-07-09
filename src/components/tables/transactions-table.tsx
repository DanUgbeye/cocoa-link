import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Transaction } from "@/types";

interface Props {
  transactions: Transaction[];
}

export default function TransactionsTable(props: Props) {
  const { transactions } = props;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>

          <TableHead className="hidden text-center sm:table-cell">
            Quantity
          </TableHead>

          <TableHead className="hidden text-center sm:table-cell">
            Amount
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {transactions.map((item, index) => {
          return (
            <TableRow
              key={item._id}
              className={cn("bg-accent", {
                " pointer-events-none opacity-50 ": item.quantity === 0,
              })}
            >
              <TableCell>
                <div className="font-medium">
                  {item.createdAt.toLocaleDateString()}
                </div>
              </TableCell>

              <TableCell>
                <div className="font-medium">{item.quantity}</div>
              </TableCell>

              <TableCell className="text-right">
                {Number(item.amount).toLocaleString(undefined, {
                  style: "currency",
                  currency: "NGN",
                })}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
