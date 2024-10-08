"use client";

import { useAppStore } from "@/client/store";
import { Container } from "@/components/container";
import FormButton from "@/components/form-button";
import Spinner from "@/components/spinner";
import { FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { PAGES } from "@/data/page-map";
import { useFormEffect } from "@/hooks/use-form-effect";
import { login } from "@/server/modules/auth/auth.actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";

export default function LoginPage() {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const { initializeStore } = useAppStore();
  const [state, action] = useFormState(login, {
    status: "UNSET",
    message: "",
    timestamp: Date.now(),
  });

  useFormEffect(state, (changedState) => {
    if (changedState.status === "ERROR") {
      toast.error(changedState.message);
    }
    if (changedState.status === "SUCCESS") {
      const initialState = changedState.data;
      if (initialState !== undefined) {
        initializeStore(initialState);
        toast.success(changedState.message);
        router.replace(PAGES.DASHBOARD);
      }
    }
  });

  useEffect(() => {
    if (user !== undefined) {
      router.replace(PAGES.DASHBOARD);
    }
  }, []);

  return (
    <main className="h-full min-h-screen">
      <Container className="py-16">
        <div className="mx-auto w-full max-w-lg space-y-10 rounded-lg bg-amber-900/40 px-6 pb-20 pt-12 sm:px-12">
          <div className="text-2xl font-bold uppercase leading-relaxed text-white md:text-3xl">
            <h2 className=" ">LOGIN</h2>
          </div>

          <form action={action} className="w-full space-y-4">
            <FormItem>
              <FormLabel className="text-white">Email</FormLabel>
              <Input
                name="email"
                id="email"
                type="email"
                placeholder="example@example.com"
                required
              />
            </FormItem>

            <FormItem>
              <FormLabel className="text-white">Password</FormLabel>
              <PasswordInput
                name="password"
                id="password"
                placeholder="********"
                required
                minLength={8}
              />
            </FormItem>

            <div className="pt-5">
              <FormButton className="w-full bg-amber-800 hover:bg-amber-700">
                {({ loading }) => {
                  return loading ? <Spinner /> : "Login";
                }}
              </FormButton>
            </div>
          </form>
        </div>

        <div className="my-5 grid grid-cols-[1fr,auto,1fr] items-center justify-center gap-x-3">
          <Link
            href={PAGES.LOGIN}
            className="ml-auto text-sm underline-offset-4 hover:underline"
          >
            Back to home
          </Link>

          <div className="h-6 w-px bg-blue-700"></div>

          <Link
            href={PAGES.SIGNUP}
            className="mr-auto text-sm underline-offset-4 hover:underline"
          >
            Signup
          </Link>
        </div>
      </Container>
    </main>
  );
}
