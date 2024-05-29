"use server";

import { PAGES } from "@/data/page-map";
import { fromErrorToFormState } from "@/lib/utils";
import connectDB from "@/server/db/connect";
import { User } from "@/types";
import { FormState } from "@/types/form.types";
import { Model } from "mongoose";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getLoggedInUser } from "../auth/auth.actions";
import { UserDocument } from "./user.types";

export async function getAllUsers() {
  try {
    const db = await connectDB();
    const userModel = db.models.User as Model<UserDocument>;
    const users = await userModel.find({ role: "user" });

    return JSON.parse(JSON.stringify(users)) as User[];
  } catch (error: any) {
    return [];
  }
}

export async function deleteUser(formState: FormState, formData: FormData) {
  try {
    const user = await getLoggedInUser();
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorised");
    }

    const userId = z.string().parse(formData.get("userId"));
    const db = await connectDB();
    const userModel = db.models.User as Model<UserDocument>;

    let res = await userModel.deleteOne({ userId });
    if (!res) {
      throw new Error("user not found");
    }
    revalidatePath(PAGES.USERS);

    return {
      message: "user deleted",
      status: "SUCCESS",
      timestamp: new Date().getTime(),
    } satisfies FormState;
  } catch (error: any) {
    return fromErrorToFormState(error);
  }
}
