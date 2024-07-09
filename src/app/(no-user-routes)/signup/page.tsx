"use client";

import { Container } from "@/components/container";
import FormButton from "@/components/form-button";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { PAGES } from "@/data/page-map";
import { useFormEffect } from "@/hooks/use-form-effect";
import { signup } from "@/server/modules/auth/auth.actions";
import { USER_ROLES, UserRole } from "@/types";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";

export default function SignupPage() {
  const [state, action] = useFormState(signup, {
    status: "UNSET",
    message: "",
    timestamp: Date.now(),
  });

  const [role, setRole] = useState<UserRole>(USER_ROLES.FARMER);

  const otherRole = useMemo(() => {
    if (role === USER_ROLES.FARMER) {
      return USER_ROLES.INDUSTRY;
    }
    return USER_ROLES.FARMER;
  }, [role]);

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
        <div className=" mx-auto w-full max-w-lg space-y-5 rounded-lg bg-amber-900/40 px-6 pb-20 pt-12 sm:px-12 ">
          <div className="  ">
            <div className=" text-2xl font-bold uppercase leading-relaxed text-white md:text-3xl ">
              <h2 className="  ">{role} SIGNUP</h2>
            </div>

            <div className="  ">
              <Button
                variant={"link"}
                className=" px-0 text-white no-underline"
                onClick={() => setRole(otherRole)}
              >
                Signup as <span className="ml-1 capitalize">{otherRole}</span>?
              </Button>
            </div>
          </div>

          <form action={action} className=" w-full space-y-4 ">
            <FormItem>
              <FormLabel className=" text-white">
                {role === USER_ROLES.INDUSTRY ? "Industry Name" : "Name"}
              </FormLabel>
              <Input
                name="name"
                id="name"
                type="text"
                placeholder="John Doe"
                required
              />
            </FormItem>

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

            <input type="hidden" name="role" value={role} />

            <div className=" pt-5 ">
              <FormButton className=" w-full bg-amber-800 hover:bg-amber-700 ">
                {({ loading }) => {
                  return loading ? <Spinner /> : "Signup";
                }}
              </FormButton>
            </div>
          </form>
        </div>

        <div className=" items-div my-5 grid grid-cols-[1fr,auto,1fr] justify-center gap-x-3">
          <Link
            href={PAGES.LOGIN}
            className=" ml-auto text-sm underline-offset-4 hover:underline "
          >
            Back to home
          </Link>

          <div className="h-6 w-px bg-blue-700 "></div>

          <Link
            href={PAGES.LOGIN}
            className=" mr-auto text-sm underline-offset-4 hover:underline "
          >
            Login
          </Link>
        </div>
      </Container>
    </main>
  );
}
