import { Container } from "@/components/container";
import DealsTable from "@/components/tables/deals-table";
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
import { DealDocument } from "@/server/modules/deal/deal.types";
import { DealStatus, FullDealWithUser } from "@/types";
import { Model } from "mongoose";
import { redirect } from "next/navigation";

export default async function MarketplacePage() {
  const user = await getLoggedInUser();
  if (!user) redirect(PAGES.LOGIN);

  const db = await connectDB();
  const dealCollection = db.models.Deal as Model<DealDocument>;

  const marketDeals = await dealCollection
    .find({ quantity: { $gt: 0 }, status: DealStatus.Pending })
    .populate("dealer")
    .populate("image");

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
              <DealsTable
                deals={
                  JSON.parse(JSON.stringify(marketDeals)) as FullDealWithUser[]
                }
              />
            )}
          </CardContent>
        </Card>
      </Container>
    </main>
  );
}
