"use client";

import { useAppStore } from "@/client/store";
import { Container } from "@/components/container";
import SellersTable from "@/components/tables/sellers-table";
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
import { CocoaStoreWithUser } from "@/types";
import Link from "next/link";

export default function AdminDashboardPage(props: {
  marketDeals: CocoaStoreWithUser[];
}) {
  const { marketDeals } = props;
  const user = useAppStore(({ user }) => user);
  const transactions = useAppStore(({ transactions }) => transactions);

  return (
    <main className="py-10">
      <Container className="space-y-10">
        <div className="space-y-1">
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            Welcome {user?.name}
          </h1>

          <div className="text-sm text-neutral-400">
            Pick up where you left off
          </div>
        </div>

        <Card>
          <CardHeader className="px-7">
            <div className="flex flex-wrap justify-between gap-4">
              <div className="space-y-1">
                <CardTitle>Market</CardTitle>
                <CardDescription>Available deals</CardDescription>
              </div>

              <div className="flex justify-end">
                <Link
                  href={PAGES.MARKET}
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
            {marketDeals.length <= 0 ? (
              <div className="py-10 text-center">no available deals</div>
            ) : (
              <SellersTable items={marketDeals} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="px-7">
            <div className="flex flex-wrap justify-between gap-4">
              <div className="space-y-1">
                <CardTitle>Transactions</CardTitle>
                <CardDescription>Transaction History</CardDescription>
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
              <TransactionsTable transactions={transactions.slice(0, 5)} />
            )}
          </CardContent>
        </Card>
      </Container>
    </main>
  );
}
