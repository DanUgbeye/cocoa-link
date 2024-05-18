"use client";

import { PAGES } from "@/data/page-map";
import { logout } from "@/server/modules/auth/auth.actions";
import { ClientUser, USER_ROLES } from "@/types/user.types";
import { Container } from "../container";
import NavLink from "./nav-link";
import Link from "next/link";
import { Power, PowerCircle } from "lucide-react";
import { Button } from "../ui/button";

interface NavbarProps {
  user?: ClientUser;
}

export default function Navbar(props: NavbarProps) {
  const { user } = props;

  async function handleLogout() {
    await logout();
  }

  return (
    <nav className=" flex items-center bg-blue-800 text-white ">
      <Container className=" h-fit ">
        <div className=" grid h-[5rem] grid-cols-[auto,1fr] items-center gap-x-6 ">
          <div className="  ">
            <Link href={PAGES.HOME} className=" text-3xl font-extralight ">
              FAMIS
            </Link>
          </div>

          <div className=" flex justify-end gap-x-12 gap-y-4 rounded-xl px-3 sm:flex-row sm:px-8 ">
            {user && (
              <div className=" mx-auto flex w-fit items-center gap-x-7 sm:mx-0 ">
                <NavLink href={PAGES.HOME} className=" ">
                  Dashboard
                </NavLink>

                {user.role === USER_ROLES.ADMIN && (
                  <>
                    <NavLink href={PAGES.ASSETS} className=" ">
                      Assets
                    </NavLink>
                  </>
                )}

                {user.role === USER_ROLES.USER && (
                  <div className="mr-auto flex ">
                    <NavLink href={"/sales"} className=" ">
                      Sales
                    </NavLink>
                  </div>
                )}

                <Button
                  onClick={handleLogout}
                  className=" flex w-fit items-center gap-x-2 rounded bg-transparent px-4 text-sm duration-300 hover:bg-white/20 "
                >
                  <Power className=" size-4 " />
                  Log out
                </Button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </nav>
  );
}
