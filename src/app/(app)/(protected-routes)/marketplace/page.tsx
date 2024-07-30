import { Container } from "@/components/container";
import SellersTable from "@/components/tables/sellers-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PAGES } from "@/data/page-map";
import connectDB from "@/server/db/connect";
import { getLoggedInUser } from "@/server/modules/auth/auth.actions";
import { CocoaStoreDocument } from "@/server/modules/cocoa-store/cocoa-store.types";
import { CocoaStoreWithUser } from "@/types";
import { Model } from "mongoose";
import { redirect } from "next/navigation";

export default async function MarketPage() {
  const user = await getLoggedInUser();
  if (!user) redirect(PAGES.LOGIN);

  const db = await connectDB();
  const cocoaStoreCollection = db.models
    .CocoaStore as Model<CocoaStoreDocument>;
  const marketDeals = await cocoaStoreCollection.find().populate("userId");

  return (
    <main className=" ">
      <Container className="py-10">
        <Card>
          <CardHeader className="px-7">
            <div className="flex flex-wrap justify-between gap-4">
              <div className="space-y-1">
                <CardTitle>Marketplace</CardTitle>
                <CardDescription>Available deals</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {marketDeals.length <= 0 ? (
              <div className="py-5 text-center">no available deals</div>
            ) : (
              <SellersTable
                items={
                  JSON.parse(
                    JSON.stringify(marketDeals)
                  ) as CocoaStoreWithUser[]
                }
              />
            )}
          </CardContent>
        </Card>
      </Container>
    </main>
  );
}
