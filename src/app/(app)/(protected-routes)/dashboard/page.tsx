import { PAGES } from "@/data/page-map";
import connectDB from "@/server/db/connect";
import { getLoggedInUser } from "@/server/modules/auth/auth.actions";
import { CocoaStoreDocument } from "@/server/modules/cocoa-store/cocoa-store.types";
import { OrderDocument } from "@/server/modules/order/order.types";
import { TransactionDocument } from "@/server/modules/transaction/transaction.types";
import {
  CocoaStoreWithUser,
  Order,
  ORDER_STATUS,
  Transaction,
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
  USER_ROLES,
} from "@/types";
import { Model } from "mongoose";
import { redirect } from "next/navigation";
import FarmerDashboardPage from "./farmer";
import IndustryDashboardPage from "./industry";

export default async function DashboardPage() {
  const user = await getLoggedInUser();
  if (!user) redirect(PAGES.LOGIN);
  const db = await connectDB();
  const orderModel = db.models.Order as Model<OrderDocument>;

  if (user.role === USER_ROLES.INDUSTRY) {
    const cocoaStoreModel = db.models.CocoaStore as Model<CocoaStoreDocument>;
    const transactionModel = db.models
      .Transaction as Model<TransactionDocument>;

    const marketDeals = await cocoaStoreModel
      .find({ quantity: { $gt: 0 } })
      .populate("userId");

    const orders = (await orderModel
      .find({
        buyerId: user._id,
      })
      .sort({ createdAt: "desc" })) as Order[];

    const transactions = (await transactionModel.find({
      userId: user._id,
      type: TRANSACTION_TYPE.DEPOSIT,
      status: TRANSACTION_STATUS.SUCCESS,
    })) as Transaction[];

    let buyerStats = {
      totalQuantityPurchased: 0,
      totalAmountSpent: 0,
      totalAmountDeposited: 0,
    };

    orders.forEach((order) => {
      if (order.status === ORDER_STATUS.COMPLETED) {
        buyerStats.totalQuantityPurchased += order.quantity;
        buyerStats.totalAmountSpent += order.amount;
      }
    });

    transactions.forEach((transaction) => {
      buyerStats.totalAmountDeposited += transaction.amount;
    });

    return (
      <IndustryDashboardPage
        stats={buyerStats}
        marketDeals={
          JSON.parse(JSON.stringify(marketDeals)) as CocoaStoreWithUser[]
        }
        orders={(JSON.parse(JSON.stringify(orders)) as Order[]).filter(
          (order) =>
            order.status !== ORDER_STATUS.CANCELLED &&
            order.status !== ORDER_STATUS.COMPLETED
        )}
      />
    );
  }

  const orders = (await orderModel
    .find({
      sellerId: user._id,
    })
    .sort({ createdAt: "desc" })) as Order[];

  return (
    <FarmerDashboardPage
      orders={(JSON.parse(JSON.stringify(orders)) as Order[]).filter(
        (order) =>
          order.status !== ORDER_STATUS.CANCELLED &&
          order.status !== ORDER_STATUS.COMPLETED
      )}
    />
  );
}
