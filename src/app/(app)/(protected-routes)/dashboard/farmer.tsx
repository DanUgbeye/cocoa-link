"use client";

import { useAppStore } from "@/client/store";
import { Container } from "@/components/container";
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
import { FullDeal, OrderWithFullDeal, UserRole } from "@/types";
import { Package, Wallet } from "lucide-react";
import Link from "next/link";
import Stats from "./stats";

interface Props {
  deals: FullDeal[];
  orders: OrderWithFullDeal[];
}

export default function FarmerDashboardPage(props: Props) {
  const { orders, deals } = props;
  const user = useAppStore(({ user }) => user);
  const transactions = useAppStore(({ transactions }) => transactions);
  const metrics = useAppStore(({ metrics }) => metrics);

  return (
    <main className="py-10">
      {user !== undefined && user.role === UserRole.Farmer && (
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
                    minimumFractionDigits:
                      user.walletBalance > 1_000_000 ? 2 : 0,
                  })}
                </span>
              </div>

              <Wallet className="size-14 stroke-1 text-amber-700 opacity-35" />
            </div>

            <div className="flex items-center justify-between gap-4 rounded bg-white p-4">
              <div className="flex flex-col">
                <span>Available Deals</span>

                <span className="text-2xl font-bold">{deals.length}</span>
              </div>

              <Package className="size-14 stroke-1 text-amber-700 opacity-35" />
            </div>
          </section>

          <section className="grid gap-5 md:grid-cols-3">
            <Stats
              name="Total Cocoa Bags Produced"
              value={Number(metrics?.totalQuantityProduced || 0).toLocaleString(
                undefined,
                {
                  notation: "compact",
                  compactDisplay: "long",
                }
              )}
            />

            <Stats
              name="Total Cocoa Bags Sold"
              value={Number(metrics?.totalQuantitySold || 0).toLocaleString(
                undefined,
                { notation: "compact", compactDisplay: "long" }
              )}
            />

            <Stats
              name="Total Amount Sold"
              value={Number(metrics?.totalAmountSold || 0).toLocaleString(
                undefined,
                {
                  notation: "compact",
                  compactDisplay: "long",
                  style: "currency",
                  currency: "NGN",
                }
              )}
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
                <OrdersTable orders={orders} />
              )}
            </CardContent>
          </Card>

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
