import connectDB from "@/server/db/connect";
import { getLoggedInUser } from "@/server/modules/auth/auth.actions";
import { CocoaStoreDocument } from "@/server/modules/cocoa-store/cocoa-store.types";
import { TransactionDocument } from "@/server/modules/transaction/transaction.types";
import { CocoaStore, Transaction } from "@/types";
import { Model } from "mongoose";
import { PropsWithChildren } from "react";
import { StoreInitialState } from ".";
import ClientStoreProvider from "./client-provider";

async function getInitialState(): Promise<StoreInitialState> {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      throw new Error("no user");
    }

    const db = await connectDB();
    const transactionsCollection = db.models
      .Transaction as Model<TransactionDocument>;
    const cocoaStoreCollection = db.models
      .CocoaStore as Model<CocoaStoreDocument>;

    const transactions = await transactionsCollection.find({
      userId: user._id,
    });
    const cocoaStore = await cocoaStoreCollection.findOne({ user: user._id });

    return {
      user,
      cocoaStore: cocoaStore
        ? (JSON.parse(JSON.stringify(cocoaStore)) as CocoaStore)
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
