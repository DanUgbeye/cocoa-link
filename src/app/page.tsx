import { Container } from "@/components/container";
import { buttonVariants } from "@/components/ui/button";
import { PAGES } from "@/data/page-map";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

export default function HomePage() {
  return (
    <main className=" flex min-h-screen flex-col items-center justify-between py-10 ">
      <Container>
        <div className=" bg-blue-800 mx-auto flex w-full max-w-lg rounded flex-col gap-y-10 text-white px-6 py-12 backdrop-blur-sm ">
          <h1 className=" text-2xl md:text-3xl font-bold text-center w-full ">
            COCOA LINK
          </h1>

          <center className=" mx-auto  w-full space-y-8 py-12 ">
            <Link
              href={PAGES.INDUSTRY_LOGIN}
              className={cn(buttonVariants(), " w-full sm:w-60 max-w-60 bg-blue-600 hover:bg-blue-500 ")}
            >
              INDUSTRY LOGIN
            </Link>

            <Link
              href={PAGES.LOGIN}
              className={cn(buttonVariants(), " w-full sm:w-60 max-w-60 bg-blue-600 hover:bg-blue-500 ")}
            >
              FARMER LOGIN
            </Link>
          </center>
        </div>
      </Container>
    </main>
  );
}
