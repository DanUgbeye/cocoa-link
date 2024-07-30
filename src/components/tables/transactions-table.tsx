import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Transaction, TRANSACTION_STATUS } from "@/types";

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

          <TableHead className="hidden sm:table-cell">Reason</TableHead>

          <TableHead className="hidden sm:table-cell">Status</TableHead>

          <TableHead className="hidden w-fit sm:table-cell">Amount</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {transactions.map((item, index) => {
          return (
            <TableRow key={item._id} className={cn("bg-accent")}>
              <TableCell>
                <div className="font-medium">
                  {new Date(item.createdAt).toDateString()}
                </div>
              </TableCell>

              <TableCell>
                <div className="font-medium">{item.type}</div>
              </TableCell>

              <TableCell>
                <div
                  className={cn("w-fit rounded px-2 py-1 font-medium", {
                    "bg-green-100 text-green-600":
                      item.status === TRANSACTION_STATUS.SUCCESS,
                    "bg-red-100 text-red-600":
                      item.status === TRANSACTION_STATUS.FAILED,
                    "bg-amber-100 text-amber-400":
                      item.status === TRANSACTION_STATUS.PENDING,
                  })}
                >
                  {item.status}
                </div>
              </TableCell>

              <TableCell
                className={cn("w-fit rounded px-2 py-1 font-medium", {
                  "text-green-500": item.amount > 0,
                  "text-red-500": item.amount < 0,
                })}
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
  );
}
