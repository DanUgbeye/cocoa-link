import { PAGES } from "@/data/page-map";
import connectDB from "@/server/db/connect";
import { getLoggedInUser } from "@/server/modules/auth/auth.actions";
import { CocoaStoreDocument } from "@/server/modules/cocoa-store/cocoa-store.types";
import {
  CocoaStoreWithUser,
  Payment,
  Transaction,
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
  USER_ROLES,
} from "@/types";
import { Model } from "mongoose";
import { redirect } from "next/navigation";
import FarmerDashboardPage from "./farmer";
import IndustryDashboardPage from "./industry";
import { PaymentDocument } from "@/server/modules/payment/payment.types";
import { TransactionDocument } from "@/server/modules/transaction/transaction.types";

export default async function DashboardPage() {
  const user = await getLoggedInUser();
  if (!user) redirect(PAGES.LOGIN);

  if (user.role === USER_ROLES.INDUSTRY) {
    const db = await connectDB();
    const cocoaStoreModel = db.models.CocoaStore as Model<CocoaStoreDocument>;
    const paymentModel = db.models.Payment as Model<PaymentDocument>;
    const transactionModel = db.models
      .Transaction as Model<TransactionDocument>;

    const marketDeals = await cocoaStoreModel.find().populate("userId");
    const purchases = (await paymentModel.find({
      buyerId: user._id,
    })) as Payment[];

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

    purchases.forEach((purchase) => {
      buyerStats.totalQuantityPurchased += purchase.quantity;
      buyerStats.totalAmountSpent += purchase.amount;
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
      />
    );
  }

  return <FarmerDashboardPage />;
}
