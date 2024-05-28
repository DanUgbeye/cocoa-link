"use client";

import { useAppStore } from "@/client/store";
import { PAGES } from "@/data/page-map";
import { logout } from "@/server/modules/auth/auth.actions";
import { User } from "@/types/user.types";
import { LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { Container } from "../container";
import { Button } from "../ui/button";

interface NavbarProps {
  user?: User;
}

export default function Navbar(props: NavbarProps) {
  const { user } = props;
  const { toggleSidenav } = useAppStore();

  async function handleLogout() {
    await logout();
  }

  return (
    <nav className=" flex items-center bg-white text-black">
      <Container className=" h-fit ">
        <div className=" flex h-[5rem] items-center gap-x-6 ">
          <div className=" flex items-center gap-x-4 lg:hidden ">
            <Button
              variant={"outline"}
              className=" size-9 bg-transparent p-2 text-black hover:bg-white/10 "
              onClick={() => {
                toggleSidenav();
              }}
            >
              <Menu />
            </Button>

            <Link href={PAGES.HOME} className=" w-full text-2xl font-semibold ">
              FAMIS
            </Link>
          </div>

          <div className=" flex w-full justify-end gap-x-12 gap-y-4 rounded-xl px-3 sm:flex-row sm:px-8 ">
            {user && (
              <Button
                onClick={handleLogout}
                className=" ml-auto flex w-fit items-center gap-x-2 rounded bg-transparent px-4 text-sm text-black duration-300 hover:bg-white/20 "
              >
                <LogOut className=" size-4 " />
                Log out
              </Button>
            )}
          </div>
        </div>
      </Container>
    </nav>
  );
}
