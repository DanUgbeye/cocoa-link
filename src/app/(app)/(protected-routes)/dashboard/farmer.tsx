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
import Stats from "./stats";

export default function FarmerDashboardPage(props: {}) {
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

        <section className="grid gap-5 md:grid-cols-3">
          <Stats
            name="Total Cocoa Sold"
            value={Number(cocoaStore?.totalSold || 0).toLocaleString(
              undefined,
              { notation: "compact", compactDisplay: "long" }
            )}
          />

          <Stats
            name="Total Cocoa Produced"
            value={Number(cocoaStore?.totalQuantity || 0).toLocaleString(
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
