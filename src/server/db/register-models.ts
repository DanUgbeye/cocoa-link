import { model } from "mongoose";
import { DealSchema } from "../modules/deal/deal.schema";
import { MetricSchema } from "../modules/metric/metric.schema";
import { OrderSchema } from "../modules/order/order.schema";
import { TransactionSchema } from "../modules/transaction/transaction.schema";
import { UploadSchema } from "../modules/upload/upload.schema";
import { userSchema } from "../modules/user/user.schema";

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

    console.log("Registering Upload Model");
    model("Upload", UploadSchema);

    global.registeredModels = true;
  }
}
