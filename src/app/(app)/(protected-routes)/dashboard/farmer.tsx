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
import { Package, Wallet } from "lucide-react";
import Link from "next/link";
import Stats from "./stats";

interface Props {}

export default function FarmerDashboardPage(props: Props) {
  const {} = props;
  const user = useAppStore(({ user }) => user);
  const transactions = useAppStore(({ transactions }) => transactions);
  const cocoaStore = useAppStore(({ cocoaStore }) => cocoaStore);

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

        <section className="grid gap-5 sm:grid-cols-2">
          <div className="flex items-center justify-between gap-4 rounded bg-white p-4">
            <div className="flex flex-col">
              <span>Wallet</span>

              <span className="text-2xl font-bold">
                {Number(user?.walletBalance || 0).toLocaleString(undefined, {
                  style: "currency",
                  currency: "NGN",
                })}
              </span>
            </div>

            <Wallet className="size-14 stroke-1 text-amber-700 opacity-35" />
          </div>

          <div className="flex items-center justify-between gap-4 rounded bg-white p-4">
            <div className="flex flex-col">
              <span>Cocoa Quantity (Bags)</span>

              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">
                  {Number(cocoaStore?.quantity || 0).toLocaleString(undefined, {
                    notation: "compact",
                    compactDisplay: "long",
                  })}
                </span>
                /
                <span className="text-xs">
                  {Number(cocoaStore?.pricePerItem || 0).toLocaleString(
                    undefined,
                    {
                      notation: "compact",
                      compactDisplay: "long",
                      style: "currency",
                      currency: "NGN",
                    }
                  )}{" "}
                  per Bag
                </span>
              </div>
            </div>

            <Package className="size-14 stroke-1 text-amber-700 opacity-35" />
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          <Stats
            name="Total Cocoa Bags Produced"
            value={Number(cocoaStore?.totalQuantityProduced || 0).toLocaleString(
              undefined,
              { notation: "compact", compactDisplay: "long" }
            )}
          />

          <Stats
            name="Total Cocoa Bags Sold"
            value={Number(cocoaStore?.totalQuantitySold || 0).toLocaleString(
              undefined,
              { notation: "compact", compactDisplay: "long" }
            )}
          />

          <Stats
            name="Total Amount Sold"
            value={Number(cocoaStore?.totalAmountSold || 0).toLocaleString(
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
    </main>
  );
}
