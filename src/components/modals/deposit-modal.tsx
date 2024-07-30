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
import { depositToWallet } from "@/server/modules/user/user.actions";
import { User } from "@/types";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import FormButton from "../form-button";
import Spinner from "../spinner";
import { FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";

export default function DepositModal() {
  const { user, depositModalOpen, toggleDepositModal, setUser } = useAppStore();
  const [state, action] = useFormState(depositToWallet, {
    status: "UNSET",
    message: "",
    timestamp: Date.now(),
  });

  useFormEffect(state, (changedState) => {
    if (changedState.status === "ERROR") {
      toast.error(changedState.message);
    }
    if (changedState.status === "SUCCESS") {
      setUser(changedState.data as unknown as User);
      toggleDepositModal();
      toast.success(changedState.message);
    }
  });

  return (
    <Dialog
      open={user !== undefined && depositModalOpen}
      onOpenChange={toggleDepositModal}
    >
      <DialogTrigger hidden></DialogTrigger>

      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle>Deposit Funds</DialogTitle>

          <DialogDescription>Deposit funds into your wallet</DialogDescription>
        </DialogHeader>

        <form action={action} className="w-full space-y-4">
          <FormItem>
            <FormLabel className="">Enter Deposit Amount</FormLabel>
            <Input
              name="amount"
              id="amount"
              type="number"
              placeholder="e.g 20,000"
              required
            />
          </FormItem>

          <div className="pt-5">
            <FormButton className="w-full bg-amber-800 hover:bg-amber-700">
              {({ loading }) => {
                return loading ? <Spinner /> : "Deposit";
              }}
            </FormButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
