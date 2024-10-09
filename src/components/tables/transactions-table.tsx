import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Transaction, TransactionStatus, TransactionType } from "@/types";

interface Props {
  transactions: Transaction[];
}

export default function TransactionsTable(props: Props) {
  const { transactions } = props;

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>

            <TableHead className="">Reason</TableHead>

            <TableHead className="">Status</TableHead>

            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {transactions.map((item, index) => {
            return (
              <TableRow key={item._id} className={cn("bg-accent")}>
                <TableCell>
                  <div className="min-w-40 font-medium">
                    {new Date(item.createdAt).toDateString()}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex flex-col font-medium">
                    <span>{item.type}</span>

                    {(item.type === TransactionType.Purchase ||
                      item.type === TransactionType.Sale ||
                      item.type === TransactionType.Refund) && (
                      <span className="text-xs uppercase text-neutral-400">{item.orderId}</span>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <div
                    className={cn("w-fit rounded px-2 py-1 font-medium", {
                      "bg-green-100 text-green-600":
                        item.status === TransactionStatus.Success,
                      "bg-red-100 text-red-600":
                        item.status === TransactionStatus.Failed,
                      "bg-amber-100 text-amber-400":
                        item.status === TransactionStatus.Pending,
                    })}
                  >
                    {item.status}
                  </div>
                </TableCell>

                <TableCell
                  className={cn(
                    "w-fit rounded px-2 py-1 text-right font-medium",
                    {
                      "text-green-500": item.amount > 0,
                      "text-red-500": item.amount < 0,
                    }
                  )}
                >
                  {item.amount > 0 && "+"}
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
    </div>
  );
}
