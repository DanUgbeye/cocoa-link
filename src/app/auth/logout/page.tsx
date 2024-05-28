"use client";

import { logout } from "@/server/modules/auth/auth.actions";
import { Loader } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function LogoutPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const redirecturl = searchParams.get("redirect");
    console.log(redirecturl);
    logout(redirecturl || undefined);
  }, []);

  return (
    <section>
      <center className=" py-10 ">
        <Loader className=" size-10 animate-spin text-blue-600 duration-300 " />
      </center>
    </section>
  );
}
