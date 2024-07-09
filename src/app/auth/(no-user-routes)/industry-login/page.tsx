"use client";

import { Container } from "@/components/container";
import FormButton from "@/components/form-button";
import Spinner from "@/components/spinner";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { PAGES } from "@/data/page-map";
import { useFormEffect } from "@/hooks/use-form-effect";
import { loginIndustry } from "@/server/modules/auth/auth.actions";
import Link from "next/link";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";

export default function AdminLoginPage() {
  const [state, action] = useFormState(loginIndustry, {
    status: "UNSET",
    message: "",
    timestamp: Date.now(),
  });

  useFormEffect(state, (changedState) => {
    if (changedState.status === "ERROR") {
      toast.error(changedState.message);
    }
    if (changedState.status === "SUCCESS") {
      toast.success(changedState.message);
    }
  });

  return (
    <main className=" h-full min-h-screen ">
      <Container className=" py-16 ">
        <div className=" mx-auto w-full max-w-lg space-y-10 rounded-lg bg-blue-800 px-6 pb-20 pt-12 sm:px-12 ">
          <div className=" text-center text-2xl font-bold uppercase leading-relaxed text-white md:text-3xl ">
            <h2 className="  ">ADMIN LOGIN</h2>
          </div>

          <form action={action} className=" w-full space-y-4 ">
            <FormItem>
              <FormLabel className=" text-white">Email</FormLabel>
              <Input
                name="email"
                id="email"
                type="email"
                placeholder="example@example.com"
                required
              />
            </FormItem>

            <FormItem>
              <FormLabel className=" text-white">Password</FormLabel>
              <PasswordInput
                name="password"
                id="password"
                placeholder="********"
                required
                minLength={8}
              />
            </FormItem>

            <div className=" pt-5 ">
              <FormButton className=" w-full bg-blue-600 hover:bg-blue-500 ">
                {({ loading }) => {
                  return loading ? <Spinner /> : "Login";
                }}
              </FormButton>
            </div>
          </form>
        </div>

        <center className=" my-5 ">
          <Link
            href={PAGES.HOME}
            className=" text-sm underline-offset-4 hover:underline "
          >
            Back to home
          </Link>
        </center>
      </Container>
    </main>
  );
}
