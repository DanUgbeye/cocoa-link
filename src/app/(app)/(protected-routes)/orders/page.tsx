import { Container } from "@/components/container";
import OrdersTable from "@/components/tables/orders-table";
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
import { OrderDocument } from "@/server/modules/order/order.types";
import { Order, USER_ROLES } from "@/types";
import { Model } from "mongoose";
import { redirect } from "next/navigation";

export default async function OrdersPage() {
  const user = await getLoggedInUser();
  if (!user) redirect(PAGES.LOGIN);

  const db = await connectDB();
  const ordersCollection = db.models.Order as Model<OrderDocument>;

  const orders = await ordersCollection
    .find({ $or: [{ buyerId: user._id }, { sellerId: user._id }] })
    .populate(user.role === USER_ROLES.FARMER ? "buyerId" : "sellerId")
    .sort({ createdAt: "desc" });

  return (
    <main className=" ">
      <Container className="py-10">
        <Card>
          <CardHeader className="px-7">
            <div className="flex flex-wrap justify-between gap-4">
              <div className="space-y-1">
                <CardTitle>Orders</CardTitle>
                <CardDescription>Available orders</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {orders.length <= 0 ? (
              <div className="py-5 text-center">no available orders</div>
            ) : (
              <OrdersTable
                orders={JSON.parse(JSON.stringify(orders)) as Order[]}
              />
            )}
          </CardContent>
        </Card>
      </Container>
    </main>
  );
}
