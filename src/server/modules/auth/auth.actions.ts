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
import { User } from "@/types";
import { FormState } from "@/types/form.types";
import { Model } from "mongoose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { UserDocument } from "../user/user.types";

export async function signup(formState: FormState, formData: FormData) {
  try {
    let validData = UserSignupSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      role: formData.get("role"),
    });

    const db = await connectDB();
    const userCollection = db.models.User as Model<UserDocument>;

    if (await userCollection.findOne({ email: validData.email })) {
      throw new Error("email already exists");
    }

    validData.password = await passwordUtil.hashPassword(validData.password);
    let user: UserDocument;

    try {
      user = await userCollection.create(validData);
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
    const userCollection = db.models.User as Model<UserDocument>;
    let user: UserDocument | null;

    try {
      user = await userCollection.findOne({ email });
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
    const userCollection = db.models.User as Model<UserDocument>;
    let user: UserDocument | null = null;

    try {
      user = await userCollection
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
