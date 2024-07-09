import { model } from "mongoose";
import { CocoaStoreSchema } from "../modules/cocoa-store/cocoa-store.schema";
import { TransactionSchema } from "../modules/transaction/transaction.schema";
import { userSchema } from "../modules/user/user.schema";

export default function registerModels() {
  if (!global.registeredModels) {
    console.log("Registering User Model");
    model("User", userSchema);

    console.log("Registering CocoaStore Model");
    model("CocoaStore", CocoaStoreSchema);

    console.log("Registering Transaction Model");
    model("Transaction", TransactionSchema);

    global.registeredModels = true;
  }
}
