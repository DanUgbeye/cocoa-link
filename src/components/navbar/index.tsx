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
import { UserRole } from "@/types";

interface NavbarProps {}

export default function Navbar(props: NavbarProps) {
  const {
    user,
    toggleSideNav,
    toggleDepositModal,
    toggleWithdrawModal,
    toggleCreateDealModal,
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
                toggleSideNav();
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
                <PopoverTrigger className="rounded-full py-1 pl-2 pr-4 duration-300 hover:bg-amber-700/10">
                  <div className="flex items-center gap-2">
                    <Avatar className="font-semibold text-amber-700">
                      <AvatarFallback>
                        {appUtils.getUserInitials(user)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="hidden flex-col sm:flex">
                      <div className="text-sm font-bold">{user.name}</div>
                      <div className="text-left text-xs capitalize text-neutral-400">
                        {user.role}
                      </div>
                    </div>
                  </div>
                </PopoverTrigger>

                <PopoverContent className="mr-8 w-52 p-2">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2 rounded px-2 py-2 text-sm font-semibold text-neutral-600">
                      <div className="flex flex-col">
                        <span className="text-xs font-normal">Wallet</span>
                        <span>
                          {Number(user.walletBalance).toLocaleString(
                            undefined,
                            {
                              style: "currency",
                              currency: "NGN",
                              notation:
                                user.walletBalance > 100_000
                                  ? "compact"
                                  : "standard",
                              compactDisplay: "short",
                            }
                          )}
                        </span>
                      </div>

                      <Wallet className="size-5" />
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

                    {user.role === UserRole.Farmer && (
                      <>
                        <div className="">
                          <Button
                            className="flex w-full items-center justify-start gap-2 rounded bg-transparent px-2 py-1 text-xs text-neutral-600 duration-300 hover:bg-amber-600/10"
                            onClick={() => toggleCreateDealModal()}
                          >
                            <PackagePlus className="stroke-1.5 size-4" />
                            Create Deal
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
