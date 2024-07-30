"use client";

import { useAppStore } from "@/client/store";
import { appUtils } from "@/client/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PAGES } from "@/data/page-map";
import { logout } from "@/server/modules/auth/auth.actions";
import {
  Boxes,
  HandCoins,
  Landmark,
  LogOut,
  Menu,
  PackagePlus,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { Container } from "../container";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { USER_ROLES } from "@/types";

interface NavbarProps {}

export default function Navbar(props: NavbarProps) {
  const {
    user,
    toggleSidenav,
    toggleDepositModal,
    toggleWithdrawModal,
    toggleAddProduceModal,
  } = useAppStore();

  async function handleLogout() {
    await logout();
  }

  return (
    <nav className="flex items-center bg-white text-black">
      <Container className="h-fit">
        <div className="flex h-[5rem] items-center gap-x-6">
          <div className="flex w-full items-center gap-x-4 lg:hidden">
            <Button
              variant={"outline"}
              className="size-9 bg-transparent p-2 text-black hover:bg-white/10"
              onClick={() => {
                toggleSidenav();
              }}
            >
              <Menu />
            </Button>

            <Link
              href={user ? PAGES.DASHBOARD : PAGES.LOGIN}
              className="w-full min-w-fit text-lg font-semibold"
            >
              COCOA LINK
            </Link>
          </div>

          <div className="ml-auto flex w-fit items-center justify-end gap-3">
            {user && (
              <Popover>
                <PopoverTrigger>
                  <Avatar className="font-semibold text-neutral-500">
                    <AvatarFallback>
                      {appUtils.getUserInitials(user)}
                    </AvatarFallback>
                  </Avatar>
                </PopoverTrigger>

                <PopoverContent className="mr-10 w-52 p-2">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2 rounded bg-neutral-100 px-2 py-2 text-sm font-semibold text-neutral-600">
                      <span>
                        {Number(user.walletBalance).toLocaleString(undefined, {
                          style: "currency",
                          currency: "NGN",
                          notation:
                            user.walletBalance > 100_000
                              ? "compact"
                              : "standard",
                          compactDisplay: "short",
                        })}
                      </span>

                      <Wallet className="size-4" />
                    </div>

                    <Separator className=" " />

                    <div className="">
                      <Button
                        className="flex w-full items-center justify-start gap-2 rounded bg-transparent px-2 py-1 text-xs text-neutral-600 duration-300 hover:bg-amber-600/10"
                        onClick={() => toggleDepositModal()}
                      >
                        <Landmark className="size-4" />
                        Deposit
                      </Button>

                      <Button
                        className="flex w-full items-center justify-start gap-2 rounded bg-transparent px-2 py-1 text-xs text-neutral-600 duration-300 hover:bg-amber-600/10"
                        onClick={() => toggleWithdrawModal()}
                      >
                        <HandCoins className="size-4" />
                        Withdraw
                      </Button>
                    </div>

                    <Separator className=" " />

                    {user.role === USER_ROLES.FARMER && (
                      <>
                        <div className="">
                          <Button
                            className="flex w-full items-center justify-start gap-2 rounded bg-transparent px-2 py-1 text-xs text-neutral-600 duration-300 hover:bg-amber-600/10"
                            onClick={() => toggleAddProduceModal()}
                          >
                            <PackagePlus className="stroke-1.5 size-4" />
                            Add Produce
                          </Button>
                        </div>

                        <Separator className=" " />
                      </>
                    )}

                    <div className=" ">
                      <Button
                        onClick={handleLogout}
                        className="flex w-full items-center justify-start gap-2 rounded bg-transparent px-2 py-1 text-xs text-red-600 duration-300 hover:bg-red-200/40 hover:text-red-700"
                      >
                        <LogOut className="size-4" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </Container>
    </nav>
  );
}
