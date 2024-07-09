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

export default function FarmerDashboardPage(props: { userId: string }) {
  const { userId } = props;
  const user = useAppStore(({ user }) => user);
  const transactions = useAppStore(({ transactions }) => transactions);

  return (
    <main className=" py-10 ">
      <Container className=" space-y-10 ">
        <div className=" space-y-1 ">
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            Welcome {user?.name}
          </h1>

          <div className=" text-sm text-neutral-400 ">
            Pick up where you left off
          </div>
        </div>

        <Card>
          <CardHeader className="px-7">
            <div className="flex flex-wrap justify-between gap-4">
              <div className=" space-y-1 ">
                <CardTitle>Transactions</CardTitle>
                <CardDescription>Transactions History</CardDescription>
              </div>

              <div className=" flex justify-end ">
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
            {[].length <= 0 ? (
              <>
                <div className=" py-10 text-center ">
                  no previous transactions
                </div>
              </>
            ) : (
              <TransactionsTable transactions={transactions} />
            )}
          </CardContent>
        </Card>
      </Container>
    </main>
  );
}
