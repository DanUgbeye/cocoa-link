import { PAGES } from "@/data/page-map";
import connectDB from "@/server/db/connect";
import { getLoggedInUser } from "@/server/modules/auth/auth.actions";
import { CocoaStoreDocument } from "@/server/modules/cocoa-store/cocoa-store.types";
import { CocoaStoreWithUser, USER_ROLES } from "@/types";
import { Model } from "mongoose";
import { redirect } from "next/navigation";
import FarmerDashboardPage from "./farmer";
import IndustryDashboardPage from "./industry";

export default async function DashboardPage() {
  const user = await getLoggedInUser();
  if (!user) redirect(PAGES.LOGIN);

  if (user.role === USER_ROLES.INDUSTRY) {
    const db = await connectDB();
    const cocoaStoreCollection = db.models
      .CocoaStore as Model<CocoaStoreDocument>;
    const marketDeals = await cocoaStoreCollection.find().populate("user");

    return (
      <IndustryDashboardPage
        userId={user._id}
        marketDeals={
          JSON.parse(JSON.stringify(marketDeals)) as CocoaStoreWithUser[]
        }
      />
    );
  }

  return <FarmerDashboardPage userId={user._id} />;
}
