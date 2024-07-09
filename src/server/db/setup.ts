import { USER_ROLES } from "@/types";
import type _mongoose from "mongoose";
import { Model } from "mongoose";
import { SERVER_CONFIG } from "../config/server.config";
import { UserDocument } from "../modules/user/user.types";
import { passwordUtil } from "../utils/password";

export async function setupDB(db: typeof _mongoose) {
  try {
    let userModel = db.models.User as Model<UserDocument>;

    // console.log("Checking Admin account ▪▪▪");
    // const adminExists = await userModel.findOne({ role: USER_ROLES.ADMIN });
    // if (adminExists !== null) {
    //   console.log("Admin account found ✅");
    //   return;
    // }
    // console.log("Admin account not found ❌");

    // let newAdmin = {
    //   name: "Admin",
    //   email: SERVER_CONFIG.ADMIN_EMAIL,
    //   password: await passwordUtil.hashPassword(SERVER_CONFIG.ADMIN_PASSWORD),
    //   role: USER_ROLES.ADMIN
    // };

    // console.log("Creating Admin account ▪▪▪");
    // await userModel.create(newAdmin);
    console.log("Admin account created ✅");
  } catch (error: any) {
    console.log("An error occured ❌", error);
  }
}
