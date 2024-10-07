"use server";

import { COOKIE_KEYS } from "@/data/keys";
import { PAGES } from "@/data/page-map";
import { fromErrorToFormState, toFormState } from "@/lib/utils";
import connectDB from "@/server/db/connect";
import { TransactionDocument } from "@/server/modules/transaction/transaction.types";
import {
  UserLoginSchema,
  UserSignupSchema,
} from "@/server/modules/user/user.validation";
import {
  BadRequestException,
  NotFoundException,
  ServerException,
} from "@/server/utils/http-exceptions";
import { passwordUtil } from "@/server/utils/password";
import { tokenUtil } from "@/server/utils/token";
import { AuthTokenPayload, Metric, Transaction, User, UserRole } from "@/types";
import { FormState } from "@/types/form.types";
import { AuthTokenPayloadSchema } from "@/validation";
import { Model } from "mongoose";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { StoreInitialState } from "@/client/store";
import { MetricDocument } from "../metric/metric.types";
import { UserDocument } from "../user/user.types";

export async function signup(
  formState: FormState<StoreInitialState | undefined>,
  formData: FormData
) {
  try {
    let validData = UserSignupSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      role: formData.get("role"),
    });

    const db = await connectDB();
    const userModel = db.models.User as Model<UserDocument>;
    const metricsModel = db.models.Metric as Model<MetricDocument>;

    if (await userModel.findOne({ email: validData.email })) {
      throw new Error("email already exists");
    }

    validData.password = await passwordUtil.hashPassword(validData.password);
    let user: UserDocument;

    try {
      user = await userModel.create(validData);
      if (validData.role === UserRole.Farmer) {
        await metricsModel.create({ userId: user._id });
      }
    } catch (error: any) {
      throw new ServerException(error.message);
    }

    const { token, expiresIn } = tokenUtil.createJwtToken<AuthTokenPayload>({
      id: String(user._id),
      role: user.role,
    });

    cookies().set({
      name: COOKIE_KEYS.AUTH,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: expiresIn,
    });

    // revalidatePath("/", "layout");

    const initialState = await getUserInitialState(
      JSON.parse(JSON.stringify(user)) as User
    );

    return toFormState("SUCCESS", "Signup successful", initialState);
  } catch (error: any) {
    return fromErrorToFormState(error);
  }
}

export async function login(
  formState: FormState<StoreInitialState | undefined>,
  formData: FormData
) {
  try {
    let { email, password } = UserLoginSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    const db = await connectDB();
    const userModel = db.models.User as Model<UserDocument>;
    let user: UserDocument | null;

    try {
      user = await userModel.findOne({ email });
    } catch (error: any) {
      throw new ServerException(error.message);
    }

    if (
      !user ||
      !(await passwordUtil.comparePassword(password, user.password))
    ) {
      throw new BadRequestException("incorrect credentials");
    }

    const { token, expiresIn } = tokenUtil.createJwtToken<AuthTokenPayload>({
      id: String(user._id),
      role: user.role,
    });

    cookies().set({
      name: COOKIE_KEYS.AUTH,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: expiresIn,
    });

    // revalidatePath("/", "layout");

    const initialState = await getUserInitialState(
      JSON.parse(JSON.stringify(user)) as User
    );

    return toFormState("SUCCESS", "Login successful", initialState);
  } catch (error: any) {
    return fromErrorToFormState(error);
  }
}

export async function logout(redirectUrl?: string) {
  cookies().delete(COOKIE_KEYS.AUTH);
  redirect(redirectUrl ? redirectUrl : PAGES.LOGIN);
}

export async function getLoggedInUser() {
  try {
    const authCookie = cookies().get(COOKIE_KEYS.AUTH);
    if (!authCookie) return undefined;

    const authToken = authCookie.value;
    const authPayload = tokenUtil.verifyJwtToken(authToken);
    const validAuthPayload = AuthTokenPayloadSchema.safeParse(authPayload);
    if (validAuthPayload.error) return undefined;

    const db = await connectDB();
    const userModel = db.models.User as Model<UserDocument>;
    let user: UserDocument | null = null;

    try {
      user = await userModel
        .findById(validAuthPayload.data.id)
        .select("-password");
    } catch (err: any) {
      throw new ServerException(err.message);
    }

    if (!user) {
      throw new NotFoundException("user profile not found");
    }

    return JSON.parse(JSON.stringify(user)) as User;
  } catch (error: any) {
    return undefined;
  }
}

export async function verifyAuth() {
  try {
    const authCookie = cookies().get(COOKIE_KEYS.AUTH);
    if (!authCookie) return true;

    const authToken = authCookie.value;
    const authPayload = tokenUtil.verifyJwtToken(authToken);
    const validAuthPayload = AuthTokenPayloadSchema.parse(authPayload);
    return true;
  } catch (error: any) {
    return false;
  }
}

export async function getUserInitialState(
  user: User
): Promise<StoreInitialState> {
  try {
    const db = await connectDB();
    const transactionsModel = db.models
      .Transaction as Model<TransactionDocument>;
    const metricsModel = db.models.Metric as Model<MetricDocument>;

    const transactions = await transactionsModel
      .find({ userId: user._id })
      .sort({ createdAt: "desc" });
    const metrics =
      (await metricsModel.findOne({ userId: user._id })) ?? undefined;

    return {
      user,
      metrics: metrics
        ? (JSON.parse(JSON.stringify(metrics)) as Metric)
        : undefined,
      transactions: JSON.parse(JSON.stringify(transactions)) as Transaction[],
    };
  } catch (error: any) {
    return { transactions: [] };
  }
}
