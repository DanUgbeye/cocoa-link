"use client";

import { useAppStore } from "@/client/store";
import { Container } from "@/components/container";
import TransactionsTable from "@/components/tables/transactions-table";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PAGES } from "@/data/page-map";
import { cn } from "@/lib/utils";
import Link from "next/link";

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

            <div className="flex justify-end">
              <Link
                href={PAGES.TRANSACTIONS}
                className={cn(
                  buttonVariants({ variant: "link" }),
                  "text-blue-700"
                )}
              >
                See all
              </Link>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {transactions.length <= 0 ? (
            <div className="py-10 text-center">no previous transactions</div>
          ) : (
            <TransactionsTable transactions={transactions} />
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
