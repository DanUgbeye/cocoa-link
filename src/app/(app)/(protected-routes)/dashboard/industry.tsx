"use client";

import { useAppStore } from "@/client/store";
import { Container } from "@/components/container";
import DealsTable from "@/components/tables/deals-table";
import OrdersTable from "@/components/tables/orders-table";
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
import { CocoaStoreWithUser, Order, USER_ROLES } from "@/types";
import { Wallet } from "lucide-react";
import Link from "next/link";
import Stats from "./stats";

export default function IndustryPage(props: {
  marketDeals: CocoaStoreWithUser[];
  stats: {
    totalQuantityPurchased: number;
    totalAmountSpent: number;
    totalAmountDeposited: number;
  };
  orders: Order[];
}) {
  const { marketDeals, stats, orders } = props;
  const user = useAppStore(({ user }) => user);
  const transactions = useAppStore(({ transactions }) => transactions);

  return (
    <main className="py-10">
      {user !== undefined && user.role === USER_ROLES.INDUSTRY && (
        <Container className="space-y-10">
          <div className="space-y-1">
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              Welcome {user.name}
            </h1>

            <div className="text-sm text-neutral-400">
              Pick up where you left off
            </div>
          </div>

          <section className="grid gap-5 sm:grid-cols-2">
            <div className="flex items-center justify-between gap-4 rounded bg-white p-4">
              <div className="flex flex-col">
                <span>Wallet</span>

                <span className="text-2xl font-bold">
                  {Number(user.walletBalance || 0).toLocaleString(undefined, {
                    style: "currency",
                    currency: "NGN",
                    notation:
                      user.walletBalance > 1_000_000 ? "compact" : "standard",
                  })}
                </span>
              </div>

              <Wallet className="size-14 stroke-1 text-amber-700 opacity-35" />
            </div>
          </section>

          <section className="grid gap-5 md:grid-cols-3">
            <Stats
              name="Total Cocoa Bags Purchased"
              value={Number(stats.totalQuantityPurchased).toLocaleString(
                undefined,
                { notation: "compact" }
              )}
            />

            <Stats
              name="Total Amount Deposited"
              value={Number(stats.totalAmountDeposited).toLocaleString(
                undefined,
                {
                  notation: "compact",
                  style: "currency",
                  currency: "NGN",
                }
              )}
            />

            <Stats
              name="Total Amount Spent"
              value={Number(stats.totalAmountSpent).toLocaleString(undefined, {
                notation: "compact",
                compactDisplay: "long",
                style: "currency",
                currency: "NGN",
              })}
            />
          </section>

          <Card>
            <CardHeader className="px-7">
              <div className="flex flex-wrap justify-between gap-4">
                <div className="space-y-1">
                  <CardTitle>Orders</CardTitle>
                  <CardDescription>Pending orders</CardDescription>
                </div>

                <div className="flex justify-end">
                  <Link
                    href={PAGES.ORDERS}
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
              {orders.length <= 0 ? (
                <div className="py-5 text-center">no pending orders</div>
              ) : (
                <OrdersTable
                  orders={JSON.parse(JSON.stringify(orders)) as Order[]}
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="px-7">
              <div className="flex flex-wrap justify-between gap-4">
                <div className="space-y-1">
                  <CardTitle>Marketplace</CardTitle>
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
                <div className="py-5 text-center">no available deals</div>
              ) : (
                <DealsTable items={marketDeals} />
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
                <div className="py-5 text-center text-neutral-400">
                  no previous transactions
                </div>
              ) : (
                <TransactionsTable transactions={transactions.slice(0, 5)} />
              )}
            </CardContent>
          </Card>
        </Container>
      )}
    </main>
  );
}
