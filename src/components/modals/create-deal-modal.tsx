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
import { createDeal } from "@/server/modules/deal/deal.actions";
import { } from "@/server/modules/metric/metric.actions";
import { CocoaVariant, UserRole } from "@/types";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import FormButton from "../form-button";
import { Select } from "../select";
import Spinner from "../spinner";
import { FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";

export default function CreateDealModal() {
  const user = useAppStore((state) => state.user);
  const createDealModalOpen = useAppStore((state) => state.createDealModalOpen);
  const { toggleCreateDealModal } = useAppStore();

  const [state, action] = useFormState(createDeal, {
    status: "UNSET",
    message: "",
    timestamp: Date.now(),
  });

  useFormEffect(state, (changedState) => {
    if (changedState.status === "ERROR") {
      toast.error(changedState.message);
    }
    if (changedState.status === "SUCCESS") {
      toggleCreateDealModal();
      toast.success(changedState.message);
      window.location.reload();
    }
  });

  return (
    <Dialog
      open={
        user !== undefined &&
        user.role === UserRole.Farmer &&
        createDealModalOpen
      }
      onOpenChange={toggleCreateDealModal}
    >
      <DialogTrigger hidden></DialogTrigger>

      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Deal</DialogTitle>

          <DialogDescription>Add a new deal for sale</DialogDescription>
        </DialogHeader>

        <form action={action} className="w-full space-y-4">
          <FormItem>
            <FormLabel className="">Variant</FormLabel>

            <Select name="variant" id="variant" required className="">
              <option value="">select variant</option>

              {Object.values(CocoaVariant).map((variant, index) => (
                <option key={`option-${variant}`} value={variant}>
                  {variant}
                </option>
              ))}
            </Select>
          </FormItem>

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
              placeholder="e.g 300,000"
              defaultValue={300_000}
              required
            />
          </FormItem>

          <FormItem>
            <FormLabel className="">upload image</FormLabel>

            <Input
              name="image"
              id="image"
              type="file"
              accept={"image/*"}
              required
            />
          </FormItem>

          <div className="pt-5">
            <FormButton className="w-full bg-amber-800 hover:bg-amber-700">
              {({ loading }) => {
                return loading ? <Spinner /> : "Create Deal";
              }}
            </FormButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
