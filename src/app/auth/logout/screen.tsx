"use client";

import Spinner from "@/components/spinner";
import { logout } from "@/server/modules/auth/auth.actions";
import { useEffect, useRef } from "react";

export default function LogoutScreen(props: { redirect?: string }) {
  const { redirect } = props;
  const redirectedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!redirectedRef.current) {
      logout(redirect);
      redirectedRef.current = true;
    }
  }, [redirect]);

  return (
    <section>
      <center className="py-10">
        <Spinner className="animate-spin text-amber-900/40 duration-700" />
      </center>
    </section>
  );
}
