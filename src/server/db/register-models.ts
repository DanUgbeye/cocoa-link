import { model } from "mongoose";
import { MetricSchema } from "../modules/metric/metric.schema";
import { OrderSchema } from "../modules/order/order.schema";
import { TransactionSchema } from "../modules/transaction/transaction.schema";
import { userSchema } from "../modules/user/user.schema";
import { DealSchema } from "../modules/deal/deal.schema";

export default function registerModels() {
  if (!global.registeredModels) {
    console.log("Registering User Model");
    model("User", userSchema);

    console.log("Registering Metric Model");
    model("Metric", MetricSchema);

    console.log("Registering Deal Model");
    model("Deal", DealSchema);

    console.log("Registering Transaction Model");
    model("Transaction", TransactionSchema);

    console.log("Registering Order Model");
    model("Order", OrderSchema);

    global.registeredModels = true;
  }
}
