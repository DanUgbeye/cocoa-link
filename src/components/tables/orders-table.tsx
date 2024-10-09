"use client";

import { useAppStore } from "@/client/store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  cancelOrder,
  completeOrder,
  deliverOrder,
} from "@/server/modules/order/order.actions";
import {
  OrderStatus,
  OrderWithDeal,
  OrderWithFullDeal,
  UserRole,
} from "@/types";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import Spinner from "../spinner";
import { Button } from "../ui/button";

interface Props {
  orders: OrderWithFullDeal[];
}

export default function OrdersTable(props: Props) {
  const { orders } = props;
  const router = useRouter();
  const { user } = useAppStore();
  const [loading, setLoading] = useState<{
    deliver: string | undefined;
    complete: string | undefined;
    cancel: string | undefined;
  }>({
    deliver: undefined,
    complete: undefined,
    cancel: undefined,
  });

  function toggleLoading(
    select: keyof typeof loading,
    state: string | undefined
  ) {
    setLoading((prev) => ({ ...prev, [select]: state }));
  }

  const actionLoading = useMemo(() => {
    for (const state of Object.values(loading)) {
      if (state) return state;
    }
    return false;
  }, [loading]);

  async function handleDeliverOrder(orderId: string) {
    try {
      toggleLoading("deliver", orderId);
      await deliverOrder(orderId);
      toast.success("Order delivered");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      toggleLoading("deliver", undefined);
    }
  }

  async function handleCancelOrder(orderId: string) {
    try {
      toggleLoading("cancel", orderId);
      await cancelOrder(orderId);
      toast.success("Order cancelled");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      toggleLoading("cancel", undefined);
    }
  }

  async function handleCompleteOrder(orderId: string) {
    try {
      toggleLoading("complete", orderId);
      await completeOrder(orderId);
      toast.success("Order completed");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      toggleLoading("complete", undefined);
    }
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>

            <TableHead className="">Location</TableHead>

            <TableHead className="">Variant</TableHead>

            <TableHead className="">Quantity</TableHead>

            <TableHead className="">Amount</TableHead>

            <TableHead className="">Status</TableHead>

            <TableHead className=""></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {orders.map((item, index) => {
            return (
              <TableRow
                key={item._id}
                className={cn("bg-accent", {
                  "pointer-events-none opacity-50": actionLoading === item._id,
                })}
              >
                <TableCell>
                  <div className="min-w-40 font-medium">
                    {new Date(item.createdAt).toDateString()}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="w-full px-2 font-medium">{item.location}</div>
                </TableCell>

                <TableCell>
                  <div className="w-full px-2 font-medium">
                    {item.dealId.variant}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="w-full px-2 font-medium">
                    {item.dealId.quantity}
                  </div>
                </TableCell>

                <TableCell className={cn("w-fit rounded font-medium")}>
                  {Number(item.amount).toLocaleString(undefined, {
                    style: "currency",
                    currency: "NGN",
                  })}
                </TableCell>

                <TableCell>
                  <div
                    className={cn(
                      "w-28 rounded px-2 py-1 text-center font-medium",
                      {
                        "bg-green-100 text-green-600":
                          item.status === OrderStatus.Completed,
                        "bg-red-100 text-red-600":
                          item.status === OrderStatus.Cancelled,
                        "bg-amber-100 text-amber-600":
                          item.status === OrderStatus.Pending,
                        "bg-pink-100 text-pink-600":
                          item.status === OrderStatus.Delivered,
                      }
                    )}
                  >
                    {item.status}
                  </div>
                </TableCell>

                <TableCell>
                  {user !== undefined && (
                    <div className={"flex justify-end gap-2"}>
                      {item.status === OrderStatus.Pending && (
                        <>
                          {user.role === UserRole.Farmer && (
                            <Button
                              className="w-32 bg-green-500 hover:bg-green-600"
                              onClick={() => handleDeliverOrder(item._id)}
                            >
                              {loading.deliver === item._id ? (
                                <Spinner />
                              ) : (
                                "Deliver Order"
                              )}
                            </Button>
                          )}

                          {user.role === UserRole.Industry && (
                            <Button
                              className="w-32 bg-red-500 hover:bg-red-600"
                              onClick={() => handleCancelOrder(item._id)}
                            >
                              {loading.cancel === item._id ? (
                                <Spinner />
                              ) : (
                                "Cancel Order"
                              )}
                            </Button>
                          )}
                        </>
                      )}

                      {item.status === OrderStatus.Delivered && (
                        <>
                          {user.role === UserRole.Farmer && (
                            <span className="italic text-neutral-400">
                              Awaiting confirmation
                            </span>
                          )}

                          {user.role === UserRole.Industry && (
                            <>
                              <Button
                                className="w-32 bg-green-500 hover:bg-green-600"
                                onClick={() => handleCompleteOrder(item._id)}
                              >
                                {loading.complete === item._id ? (
                                  <Spinner />
                                ) : (
                                  "Confirm Order"
                                )}
                              </Button>
                            </>
                          )}
                        </>
                      )}

                      {item.status === OrderStatus.Completed && (
                        <span className="italic text-neutral-400">
                          Order completed
                        </span>
                      )}

                      {item.status === OrderStatus.Cancelled && (
                        <span className="italic text-neutral-400">
                          Order cancelled
                        </span>
                      )}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
