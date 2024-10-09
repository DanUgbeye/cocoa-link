"use client";

import { useAppStore } from "@/client/store";
import { Container } from "@/components/container";
import TransactionsTable from "@/components/tables/transactions-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TransactionsPage() {
  const { user, transactions } = useAppStore();

  return (
    <Container className="py-10">
      <Card>
        <CardHeader className="px-7">
          <div className="flex flex-wrap justify-between gap-4">
            <div className="space-y-1">
              <CardTitle>Transactions</CardTitle>
              <CardDescription>Transactions History</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {transactions.length <= 0 ? (
            <div className="py-5 text-center text-neutral-400">
              no previous transactions
            </div>
          ) : (
            <TransactionsTable transactions={transactions} />
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
