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
import { updateCocoaStoreQuantity } from "@/server/modules/cocoa-store/cocoa-store.actions";
import { CocoaStore, USER_ROLES } from "@/types";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import FormButton from "../form-button";
import Spinner from "../spinner";
import { FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";

export default function AddProduceModal() {
  const {
    user,
    cocoaStore,
    addProduceModalOpen,
    toggleAddProduceModal,
    setCocoaStore,
  } = useAppStore();
  const [state, action] = useFormState(updateCocoaStoreQuantity, {
    status: "UNSET",
    message: "",
    timestamp: Date.now(),
  });

  useFormEffect(state, (changedState) => {
    if (changedState.status === "ERROR") {
      toast.error(changedState.message);
    }
    if (changedState.status === "SUCCESS") {
      setCocoaStore(changedState.data as unknown as CocoaStore);
      toggleAddProduceModal();
      toast.success(changedState.message);
    }
  });

  return (
    <Dialog
      open={
        user !== undefined &&
        user.role === USER_ROLES.FARMER &&
        addProduceModalOpen
      }
      onOpenChange={toggleAddProduceModal}
    >
      <DialogTrigger hidden></DialogTrigger>

      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Produce</DialogTitle>

          <DialogDescription>Add new harvest for sale</DialogDescription>
        </DialogHeader>

        <form action={action} className="w-full space-y-4">
          <FormItem>
            <FormLabel className="">Cocoa Quantity (in bags)</FormLabel>
            <Input
              name="quantity"
              id="quantity"
              type="number"
              placeholder="e.g 20 bags"
              required
            />
          </FormItem>

          <FormItem>
            <FormLabel className="">Price Per Bag</FormLabel>

            <Input
              name="pricePerItem"
              id="pricePerItem"
              type="number"
              placeholder="e.g 300"
              defaultValue={cocoaStore?.pricePerItem}
              required
            />
          </FormItem>

          <div className="pt-5">
            <FormButton className="w-full bg-amber-800 hover:bg-amber-700">
              {({ loading }) => {
                return loading ? <Spinner /> : "Add";
              }}
            </FormButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
