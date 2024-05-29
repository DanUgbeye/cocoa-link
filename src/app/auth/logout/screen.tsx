"use client";

import Spinner from "@/components/spinner";
import { logout } from "@/server/modules/auth/auth.actions";
import { useEffect } from "react";

export default function LogoutScreen(props: { redirect?: string }) {
  const { redirect } = props;

  useEffect(() => {
    logout(redirect);
  }, []);

  return (
    <section>
      <center className=" py-10 ">
        <Spinner className=" size-10 animate-spin text-blue-600 duration-700 " />
      </center>
    </section>
  );
}
