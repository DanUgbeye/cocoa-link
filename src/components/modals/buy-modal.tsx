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
import { makePayment } from "@/server/modules/payment/payment.actions";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import FormButton from "../form-button";
import Spinner from "../spinner";
import { FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { useRouter } from "next/navigation";

export default function BuyModal() {
  const router = useRouter();
  const { user, selectedDeal, setSelctedDeal, setUser } = useAppStore();
  const [state, action] = useFormState(makePayment, {
    status: "UNSET",
    message: "",
    timestamp: Date.now(),
  });

  const [formData, setFormData] = useState({ quantity: 0, amount: 0 });
  const [formErrors, setFormErrors] = useState<{
    [key in keyof typeof formData]: string | undefined;
  }>({
    quantity: undefined,
    amount: undefined,
  });

  function handleInput(field: keyof typeof formData, value: number) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function reset() {
    setFormData({ amount: 0, quantity: 0 });
    setFormErrors({ amount: undefined, quantity: undefined });
  }

  function errorsExist() {
    if (formErrors.amount !== undefined || formErrors.quantity !== undefined) {
      return true;
    }
    return false;
  }

  useFormEffect(state, (changedState) => {
    if (changedState.status === "ERROR") {
      toast.error(changedState.message);
    }
    if (changedState.status === "SUCCESS") {
      setSelctedDeal(undefined);
      reset();
      toast.success(changedState.message);
      window.location.reload()
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
    if (!selectedDeal || !user) return;

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
        quantity: "quantity is required",
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
  }, [formData, user, selectedDeal]);

  return (
    <Dialog
      open={user !== undefined && selectedDeal !== undefined}
      onOpenChange={() => setSelctedDeal()}
    >
      {user !== undefined && selectedDeal !== undefined && (
        <>
          <DialogTrigger hidden></DialogTrigger>

          <DialogContent className="w-full max-w-xl">
            <DialogHeader>
              <DialogTitle>{selectedDeal.userId.name}</DialogTitle>
              <DialogDescription>{selectedDeal.userId.email}</DialogDescription>
            </DialogHeader>

            <Separator />

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
                        // notation: "compact",
                      }
                    )}{" "}
                    per bag
                  </div>
                </div>
              </div>
            </div>

            <form action={action} className="w-full space-y-4 pt-6">
              <FormItem>
                <FormLabel className="">Enter Quantity to Purchase</FormLabel>

                <Input
                  name="quantity"
                  id="quantity"
                  type="number"
                  placeholder="e.g 20,000"
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

              <div className="pt-5">
                <FormButton
                  disabled={errorsExist()}
                  size={"lg"}
                  className="w-full bg-amber-800 hover:bg-amber-700"
                >
                  {({ loading }) => {
                    return loading ? <Spinner /> : "Buy";
                  }}
                </FormButton>
              </div>
            </form>
          </DialogContent>
        </>
      )}
    </Dialog>
  );
}
