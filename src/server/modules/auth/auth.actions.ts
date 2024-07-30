"use server";

import { COOKIE_KEYS } from "@/data/keys";
import { PAGES } from "@/data/page-map";
import { fromErrorToFormState } from "@/lib/utils";
import connectDB from "@/server/db/connect";
import { AuthTokenPayload } from "@/server/modules/auth/auth.types";
import { AuthTokenPayloadSchema } from "@/server/modules/auth/auth.validation";
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
import { User, USER_ROLES } from "@/types";
import { FormState } from "@/types/form.types";
import { Model } from "mongoose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { UserDocument } from "../user/user.types";
import { CocoaStoreDocument } from "../cocoa-store/cocoa-store.types";

export async function signup(formState: FormState, formData: FormData) {
  try {
    let validData = UserSignupSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      role: formData.get("role"),
    });

    const db = await connectDB();
    const userModel = db.models.User as Model<UserDocument>;
    const cocoaStoreModel = db.models.CocoaStore as Model<CocoaStoreDocument>;

    if (await userModel.findOne({ email: validData.email })) {
      throw new Error("email already exists");
    }

    validData.password = await passwordUtil.hashPassword(validData.password);
    let user: UserDocument;

    try {
      user = await userModel.create(validData);
      if (validData.role === USER_ROLES.FARMER) {
        await cocoaStoreModel.create({ user: user._id });
      }
    } catch (error: any) {
      throw new ServerException(error.message);
    }

    const { token, expiresIn } = tokenUtil.createJwtToken<AuthTokenPayload>({
      id: user._id as string,
      role: user.role,
    });

    cookies().set({
      name: COOKIE_KEYS.AUTH,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: expiresIn,
    });

    redirect(PAGES.DASHBOARD);
  } catch (error: any) {
    return fromErrorToFormState(error);
  }
}

export async function login(formState: FormState, formData: FormData) {
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
      id: user._id as string,
      role: user.role,
    });

    cookies().set({
      name: COOKIE_KEYS.AUTH,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: expiresIn,
    });

    redirect(PAGES.DASHBOARD);
  } catch (error: any) {
    return fromErrorToFormState(error);
  }
}

export async function logout(redirectUrl?: string) {
  cookies().delete(COOKIE_KEYS.AUTH);
  redirect(redirectUrl ? redirectUrl : PAGES.LOGIN);
}

export const getLoggedInUser = cache(async () => {
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
});

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
