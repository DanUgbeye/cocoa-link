"use server";

import { COOKIE_KEYS } from "@/data/keys";
import { PAGES } from "@/data/page-map";
import { fromErrorToFormState } from "@/lib/utils";
import connectDB from "@/server/db/connect";
import { AuthTokenPayload } from "@/server/modules/auth/auth.types";
import UserRepository from "@/server/modules/user/user.repository";
import {
  UserLoginSchema,
  UserSignupSchema,
} from "@/server/modules/user/user.validation";
import { passwordUtil } from "@/server/utils/password";
import { tokenUtil } from "@/server/utils/token";
import { USER_ROLES } from "@/types";
import { FormState } from "@/types/form.types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signupUser(formState: FormState, formData: FormData) {
  try {
    let validData = UserSignupSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    });

    const db = await connectDB();
    const userRepo = new UserRepository(db);
    if (await userRepo.collection.findOne({ email: validData.email })) {
      throw new Error("email already exists");
    }
    validData.password = await passwordUtil.hashPassword(validData.password);
    const res = await userRepo.signup(validData);

    const { token, expiresIn } = tokenUtil.createJwtToken<AuthTokenPayload>({
      id: res._id as string,
      role: res.role,
    });

    cookies().set({
      name: COOKIE_KEYS.AUTH,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: expiresIn,
    });
  } catch (error: any) {
    // console.log(error);
    return fromErrorToFormState(error);
  }

  redirect(PAGES.DASHBOARD);
}

export async function loginUser(formState: FormState, formData: FormData) {
  try {
    let validData = UserLoginSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    const db = await connectDB();
    const userRepo = new UserRepository(db);
    const res = await userRepo.login(validData);

    const { token, expiresIn } = tokenUtil.createJwtToken<AuthTokenPayload>({
      id: res._id as string,
      role: res.role,
    });

    cookies().set({
      name: COOKIE_KEYS.AUTH,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: expiresIn,
    });
  } catch (error: any) {
    // console.log(error);
    return fromErrorToFormState(error);
  }

  redirect(PAGES.DASHBOARD);
}

export async function loginAdmin(formState: FormState, formData: FormData) {
  try {
    let validData = UserLoginSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    const db = await connectDB();
    const userRepo = new UserRepository(db);
    const res = await userRepo.login(validData, USER_ROLES.ADMIN);

    const { token, expiresIn } = tokenUtil.createJwtToken<AuthTokenPayload>({
      id: res._id as string,
      role: res.role,
    });

    cookies().set({
      name: COOKIE_KEYS.AUTH,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: expiresIn,
    });
  } catch (error: any) {
    // console.log(error);
    return fromErrorToFormState(error);
  }
  redirect(PAGES.DASHBOARD);
}

export async function logout() {
  cookies().delete(COOKIE_KEYS.AUTH);
  redirect(PAGES.HOME);
}
