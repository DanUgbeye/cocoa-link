"use client";

import { Container } from "@/components/container";
import { PAGES } from "@/data/page-map";
import { UserLoginData } from "@/types/user.types";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const initialValues: UserLoginData = {
    email: "",
    password: "",
  };

  return (
    <main className=" h-full min-h-screen ">
      <Container className=" py-16 ">
        <div className=" mx-auto w-full max-w-lg rounded-lg bg-white px-6 pb-20 pt-12 sm:px-12 ">
          <div className=" mb-4 text-center text-4xl font-bold uppercase leading-relaxed text-blue-700 ">
            <h2 className="  ">USER LOGIN</h2>
          </div>

          <form className="  w-full "></form>
        </div>

        <div className=" my-12 ">
          <Link
            href={PAGES.HOME}
            className=" text-white underline-offset-4 hover:underline "
          >
            Back to home
          </Link>
        </div>
      </Container>
    </main>
  );
}
