import { model } from "mongoose";
import { activitySchema } from "../modules/activity/activity.schema";
import { applicationSchema } from "../modules/applications/application.schema";
import { assetSchema } from "../modules/asset/asset.schema";
import { userSchema } from "../modules/user/user.schema";

export default function registerModels() {
  if (!global.registeredModels) {
    console.log("Registering User Model");
    model("User", userSchema);

    console.log("Registering Asset Model");
    model("Asset", assetSchema);

    console.log("Registering Activity Model");
    model("Activity", activitySchema);

    console.log("Registering Appication Model");
    model("Application", applicationSchema);

    global.registeredModels = true;
  }
}
