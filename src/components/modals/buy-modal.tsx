"use client";

import { useAppStore } from "@/client/store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useFormEffect } from "@/hooks/use-form-effect";
import { createOrder } from "@/server/modules/order/order.actions";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import FormButton from "../form-button";
import Spinner from "../spinner";
import { FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";

export default function BuyModal() {
  const router = useRouter();
  const { user, selectedDeal, setSelctedDeal } = useAppStore();
  const [state, action] = useFormState(createOrder, {
    status: "UNSET",
    message: "",
    timestamp: Date.now(),
  });

  const [formDirty, setFormDirty] = useState(false);
  const [formData, setFormData] = useState({
    quantity: 0,
    amount: 0,
    location: "",
  });
  const [formErrors, setFormErrors] = useState<{
    [key in keyof typeof formData]: string | undefined;
  }>({
    quantity: undefined,
    amount: undefined,
    location: undefined,
  });

  function handleInput<TKey extends keyof typeof formData>(
    field: TKey,
    value: (typeof formData)[TKey]
  ) {
    setFormDirty(true);
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function reset() {
    setFormDirty(false);
    setFormData({ amount: 0, quantity: 0, location: "" });
    setFormErrors({
      amount: undefined,
      quantity: undefined,
      location: undefined,
    });
  }

  const errorsExist = useMemo(() => {
    if (formErrors.amount !== undefined || formErrors.quantity !== undefined) {
      return true;
    }
    return false;
  }, [formErrors]);

  useFormEffect(state, (changedState) => {
    if (changedState.status === "ERROR") {
      toast.error(changedState.message);
    }
    if (changedState.status === "SUCCESS") {
      setSelctedDeal(undefined);
      reset();
      toast.success(changedState.message);
      window.location.reload();
    }
  });

  useEffect(() => {
    if (!selectedDeal) return;

    const quantity = formData.quantity ? Number(formData.quantity) : 0;
    const amount = quantity * selectedDeal.pricePerItem;
    handleInput("amount", amount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.quantity, selectedDeal]);

  useEffect(() => {
    if (!selectedDeal || !user || !formDirty) return;

    if (formData.amount && formData.amount > user.walletBalance) {
      setFormErrors((prev) => ({
        ...prev,
        amount: "Wallet balance insufficient",
      }));
    } else {
      setFormErrors((prev) => ({
        ...prev,
        amount: undefined,
      }));
    }

    if (!formData.quantity || formData.quantity === 0) {
      setFormErrors((prev) => ({
        ...prev,
        quantity: "Quantity is required",
      }));
    } else if (formData.quantity > selectedDeal.quantity) {
      setFormErrors((prev) => ({
        ...prev,
        quantity: "Not enough quantity",
      }));
    } else {
      setFormErrors((prev) => ({
        ...prev,
        quantity: undefined,
      }));
    }

    if (formData.location === undefined || formData.location.length === 0) {
      setFormErrors((prev) => ({ ...prev, location: "Location is required" }));
    } else {
      setFormErrors((prev) => ({ ...prev, location: undefined }));
    }
  }, [formData, formDirty, user, selectedDeal]);

  return (
    <Dialog
      open={user !== undefined && selectedDeal !== undefined}
      onOpenChange={() => setSelctedDeal()}
    >
      {user !== undefined && selectedDeal !== undefined && (
        <>
          <DialogTrigger hidden></DialogTrigger>

          <DialogContent className="max-h-[calc(100dvh-5rem)] w-full max-w-xl gap-2 px-0">
            <div className="space-y-2 px-5">
              <div className="text-xs uppercase text-neutral-400">
                {selectedDeal.userId.role}
              </div>

              <DialogHeader className="space-y-0">
                <DialogTitle>{selectedDeal.userId.name}</DialogTitle>
                <DialogDescription>
                  {selectedDeal.userId.email}
                </DialogDescription>
              </DialogHeader>
            </div>

            <Separator />

            <form
              action={!errorsExist ? action : undefined}
              className="flex flex-col gap-2"
            >
              <div className="h-full max-h-[calc(100dvh-25rem)] w-full overflow-y-auto px-5">
                <div className="flex flex-col pt-3">
                  <div className="flex items-center gap-3">
                    <div className="text-6xl font-bold">
                      {selectedDeal.quantity}
                    </div>

                    <div className=" ">
                      <div className="text-lg font-bold">Bags Available</div>

                      <div className="text-xs text-neutral-500">
                        {Number(selectedDeal.pricePerItem).toLocaleString(
                          undefined,
                          {
                            style: "currency",
                            currency: "NGN",
                          }
                        )}{" "}
                        per bag
                      </div>
                    </div>
                  </div>
                </div>

                <fieldset className="space-y-4 px-1.5 pt-6">
                  <FormItem>
                    <FormLabel className="">Enter Location for delivery</FormLabel>

                    <Input
                      name="location"
                      id="location"
                      type="text"
                      placeholder="e.g Lagos"
                      value={formData.location || ""}
                      onChange={(e) =>
                        handleInput("location", String(e.target.value))
                      }
                      required
                    />

                    <FormMessage message={formErrors.location} />
                  </FormItem>

                  <FormItem>
                    <FormLabel className="">
                      Enter Quantity in Bags
                    </FormLabel>

                    <Input
                      name="quantity"
                      id="quantity"
                      type="number"
                      placeholder="e.g 20"
                      value={formData.quantity || ""}
                      onChange={(e) =>
                        handleInput("quantity", Number(e.target.value || 0))
                      }
                      required
                      max={selectedDeal.quantity}
                    />

                    <FormMessage message={formErrors.quantity} />
                  </FormItem>

                  <FormItem>
                    <FormLabel className="">Total Cost</FormLabel>
                    <Input
                      name="amount"
                      id="amount"
                      type="number"
                      value={formData.amount}
                      hidden
                      className="hidden"
                    />

                    <Input
                      name="buyerId"
                      id="buyerId"
                      type="text"
                      defaultValue={user._id}
                      hidden
                      className="hidden"
                    />

                    <Input
                      name="sellerId"
                      id="sellerId"
                      type="text"
                      defaultValue={selectedDeal.userId._id}
                      hidden
                      className="hidden"
                    />

                    <div className="text-lg font-bold">
                      {Number(formData.amount).toLocaleString(undefined, {
                        style: "currency",
                        currency: "NGN",
                      })}
                    </div>

                    <FormMessage message={formErrors.amount} />
                  </FormItem>
                </fieldset>
              </div>

              <Separator />

              <div className="space-y-2 px-5 pt-5">
                <FormButton
                  disabled={errorsExist}
                  size={"lg"}
                  className="w-full bg-amber-800 hover:bg-amber-700"
                >
                  {({ loading }) => {
                    return loading ? <Spinner /> : "Place Order";
                  }}
                </FormButton>

                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-xs text-neutral-400">
                    Wallet Balance:{" "}
                  </span>
                  <span className="text-sm font-bold">
                    {Number(user.walletBalance).toLocaleString(undefined, {
                      style: "currency",
                      currency: "NGN",
                      notation:
                        user.walletBalance > 1_000_000 ? "compact" : "standard",
                    })}
                  </span>
                </div>
              </div>
            </form>
          </DialogContent>
        </>
      )}
    </Dialog>
  );
}
