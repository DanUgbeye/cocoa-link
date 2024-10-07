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
import { OrderDocument } from "@/server/modules/order/order.types";
import { Deal, Order, OrderWithDeal, UserRole } from "@/types";
import { Model } from "mongoose";
import { redirect } from "next/navigation";
import { MyDealCard } from "./deal-card";

export default async function DealsPage() {
  const user = await getLoggedInUser();
  if (!user) redirect(PAGES.LOGIN);

  if (user.role !== UserRole.Farmer) {
    redirect(PAGES.DASHBOARD);
  }

  const db = await connectDB();
  const dealModel = db.models.Deal as Model<DealDocument>;

  const deals = await dealModel
    .find({ dealer: user._id })
    .sort({ createdAt: "desc" });

  const dealsAsObjects = JSON.parse(JSON.stringify(deals)) as Deal[];

  return (
    <main className=" ">
      <Container className="py-10">
        <Card>
          <CardHeader className="px-7">
            <div className="flex flex-wrap justify-between gap-4">
              <div className="space-y-1">
                <CardTitle>Deals</CardTitle>
                <CardDescription>Your available deals</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {dealsAsObjects.length <= 0 ? (
              <div className="py-5 text-center">no available deals</div>
            ) : (
              <div className="">
                {dealsAsObjects.map((deal) => (
                  <MyDealCard key={deal._id} deal={deal} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </Container>
    </main>
  );
}
