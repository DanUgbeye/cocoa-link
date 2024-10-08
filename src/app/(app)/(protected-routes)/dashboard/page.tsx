import { PAGES } from "@/data/page-map";
import connectDB from "@/server/db/connect";
import { getLoggedInUser } from "@/server/modules/auth/auth.actions";
import { DealDocument } from "@/server/modules/deal/deal.types";
import { OrderDocument } from "@/server/modules/order/order.types";
import {
  FullDeal,
  FullDealWithUser,
  OrderStatus,
  OrderWithDeal,
  OrderWithFullDeal,
  UserRole
} from "@/types";
import { Model } from "mongoose";
import { redirect } from "next/navigation";
import FarmerDashboardPage from "./farmer";
import IndustryDashboardPage from "./industry";

export default async function DashboardPage() {
  const user = await getLoggedInUser();
  if (!user) redirect(PAGES.LOGIN);

  const db = await connectDB();
  const dealModel = db.models.Deal as Model<DealDocument>;
  const orderModel = db.models.Order as Model<OrderDocument>;
  const orders = await orderModel
    .find({
      $or: [{ buyerId: user._id }, { sellerId: user._id }],
      status: { $nin: [OrderStatus.Cancelled, OrderStatus.Completed] },
    })
    .populate("dealId")
    .populate("dealId.image")
    .sort({ createdAt: "desc" });

  if (user.role === UserRole.Industry) {
    const marketDeals = await dealModel
      .find()
      .populate("dealer")
      .populate("image");

    return (
      <IndustryDashboardPage
        marketDeals={
          JSON.parse(JSON.stringify(marketDeals)) as FullDealWithUser[]
        }
        orders={JSON.parse(JSON.stringify(orders)) as OrderWithFullDeal[]}
      />
    );
  }

  const deals = await dealModel.find({ dealer: user._id }).populate("image");

  return (
    <FarmerDashboardPage
      deals={JSON.parse(JSON.stringify(deals)) as FullDeal[]}
      orders={JSON.parse(JSON.stringify(orders)) as OrderWithDeal[]}
    />
  );
}
