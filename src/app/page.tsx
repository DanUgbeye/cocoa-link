"use client";

import { Container } from "@/components/container";
import Link from "next/link";
import React from "react";

export default function HomePage() {
  return (
    <main className=" flex min-h-screen flex-col items-center justify-between p-24 ">
      <Container>
        <div className=" mx-auto flex w-full flex-col gap-y-12 rounded-lg bg-white/20 py-12 backdrop-blur-sm ">
          <h1 className=" text-4xl font-bold ">
            FIXED ASSETS MANAGEMENT INFORMATION SYSTEM
          </h1>

          <div className=" mx-auto flex w-full max-w-sm flex-col gap-y-8 py-12 ">
            <Link
              href={"/auth/manager-login"}
              className=" grid h-12 place-items-center rounded-lg border border-black bg-blue-600 font-bold transition-all duration-300 hover:bg-blue-800 "
            >
              ADMIN LOGIN
            </Link>

            <Link
              href={"/auth/employee-login"}
              className=" grid h-12 place-items-center rounded-lg border border-black bg-blue-600 font-bold transition-all duration-300 hover:bg-blue-800 "
            >
              USER LOGIN
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}
