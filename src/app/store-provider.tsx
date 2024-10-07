import connectDB from "@/server/db/connect";
import { getLoggedInUser } from "@/server/modules/auth/auth.actions";
import { MetricDocument } from "@/server/modules/metric/metric.types";
import { TransactionDocument } from "@/server/modules/transaction/transaction.types";
import { Metric, Transaction } from "@/types";
import { Model } from "mongoose";
import { revalidatePath } from "next/cache";
import { PropsWithChildren } from "react";
import { StoreInitialState } from "../client/store";
import ClientStoreProvider from "../client/store/provider";
import { cookies } from "next/headers";
import { COOKIE_KEYS } from "@/data/keys";
import { redirect } from "next/navigation";
import { PAGES } from "@/data/page-map";

async function getInitialState(): Promise<StoreInitialState> {
  try {
    revalidatePath("/", "layout");
    const user = await getLoggedInUser();
    if (!user) {
      if (cookies().has(COOKIE_KEYS.AUTH)) {
        redirect(PAGES.LOGOUT);
      }

      return { transactions: [] };
    }

    const db = await connectDB();
    const transactionsModel = db.models
      .Transaction as Model<TransactionDocument>;
    const metricsModel = db.models.Metric as Model<MetricDocument>;

    const transactions = await transactionsModel
      .find({ userId: user._id })
      .sort({ createdAt: "desc" });
    const metrics =
      (await metricsModel.findOne({ userId: user._id })) ?? undefined;

    return {
      user,
      metrics: metrics
        ? (JSON.parse(JSON.stringify(metrics)) as Metric)
        : undefined,
      transactions: JSON.parse(JSON.stringify(transactions)) as Transaction[],
    };
  } catch (error: any) {
    return { transactions: [] };
  }
}

interface Props extends PropsWithChildren {}

export default async function StoreProvider(props: Props) {
  const { children } = props;
  const initialState = await getInitialState();

  return (
    <ClientStoreProvider initialState={initialState}>
      {children}
    </ClientStoreProvider>
  );
}
