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

export default function BuyModal() {
  const router = useRouter();
  const { user, selectedDeal, setSelectedDeal } = useAppStore();
  const [state, action] = useFormState(createOrder, {
    status: "UNSET",
    message: "",
    timestamp: Date.now(),
  });

  const dealAmount = useMemo(() => {
    if (!selectedDeal) return 0;
    return selectedDeal.pricePerItem * selectedDeal.quantity;
  }, [selectedDeal]);

  const [formDirty, setFormDirty] = useState(false);
  const [formData, setFormData] = useState({
    amount: dealAmount,
    // location: "",
  });
  const [formErrors, setFormErrors] = useState<{
    [key in keyof typeof formData]: string | undefined;
  }>({
    amount: undefined,
    // location: undefined,
  });

  function handleInput<TKey extends keyof typeof formData>(
    field: TKey,
    value: (typeof formData)[TKey]
  ) {
    !formDirty && setFormDirty(true);
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function reset() {
    setFormDirty(false);
    setFormData({ amount: dealAmount });
    setFormErrors({
      amount: undefined,
      // location: undefined,
    });
  }

  const errorsExist = useMemo(() => {
    if (Object.values(formErrors).some((error) => error !== undefined)) {
      return true;
    }
    return false;
  }, [formErrors]);

  useFormEffect(state, (changedState) => {
    if (changedState.status === "ERROR") {
      toast.error(changedState.message);
    }
    if (changedState.status === "SUCCESS") {
      setSelectedDeal(undefined);
      reset();
      toast.success(changedState.message);
      window.location.reload();
    }
  });

  useEffect(() => {
    if (dealAmount !== formData.amount) {
      setFormData((prev) => ({ ...prev, amount: dealAmount }));
    }
  }, [formData, dealAmount]);

  useEffect(() => {
    if (!selectedDeal || !user || !formDirty) return;

    if (formData.amount > user.walletBalance) {
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

    // if (formData.location === undefined || formData.location.length === 0) {
    //   setFormErrors((prev) => ({ ...prev, location: "Location is required" }));
    // } else {
    //   setFormErrors((prev) => ({ ...prev, location: undefined }));
    // }
  }, [formData, formDirty, user, selectedDeal]);

  return (
    <Dialog
      open={user !== undefined && selectedDeal !== undefined}
      onOpenChange={() => setSelectedDeal()}
    >
      {user !== undefined && selectedDeal !== undefined && (
        <>
          <DialogTrigger hidden></DialogTrigger>

          <DialogContent className="w-full max-w-xl gap-2 px-0">
            <form
              action={!errorsExist ? action : undefined}
              className="grid h-[min(35rem,calc(100dvh-2rem))] w-full grid-rows-[auto,1fr,auto] gap-2 divide-y"
            >
              <div className="space-y-2 px-5">
                <div className="text-xs uppercase text-neutral-400">
                  {selectedDeal.dealer.role}
                </div>

                <DialogHeader className="space-y-0">
                  <DialogTitle>{selectedDeal.dealer.name}</DialogTitle>
                  <DialogDescription>
                    {selectedDeal.dealer.email}
                  </DialogDescription>
                </DialogHeader>
              </div>

              <div className="w-full overflow-y-auto px-5 py-2">
                <div className="flex flex-col gap-4 pt-3">
                  <div className="relative overflow-clip rounded border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedDeal.image.url}
                      alt="deal display image"
                      className="h-60 w-full overflow-clip rounded object-cover"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-6xl font-bold">
                      {selectedDeal.quantity}
                    </div>

                    <div className=" ">
                      <div className="text-lg font-bold">Bags Available</div>

                      <div className="text-xs text-neutral-500">
                        {Number(selectedDeal.pricePerItem).toLocaleString(
                          undefined,
                          { style: "currency", currency: "NGN" }
                        )}{" "}
                        per bag
                      </div>
                    </div>
                  </div>
                </div>

                <fieldset className="space-y-4 px-1.5 pt-2">
                  <Input
                    name="dealId"
                    id="dealId"
                    type="string"
                    defaultValue={selectedDeal._id}
                    className="hidden"
                  />

                  <FormItem className="space-y-0">
                    <FormLabel className="text-neutral-400">Total Cost</FormLabel>

                    <div className="">
                      <div className="text-lg font-bold">
                        {Number(dealAmount).toLocaleString(undefined, {
                          style: "currency",
                          currency: "NGN",
                        })}
                      </div>

                      <FormMessage
                        message={
                          dealAmount > user.walletBalance
                            ? "Wallet balance insufficient"
                            : undefined
                        }
                      />
                    </div>
                  </FormItem>

                  {selectedDeal.location && (
                    <FormItem className="space-y-0">
                      <FormLabel className="text-neutral-400">Location</FormLabel>

                      <div className="truncate text-lg font-semibold">
                        {selectedDeal.location}
                      </div>
                    </FormItem>
                  )}
                </fieldset>
              </div>

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
