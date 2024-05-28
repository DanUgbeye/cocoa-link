"use client";

import { Container } from "@/components/container";
import FormButton from "@/components/form-button";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PAGES } from "@/data/page-map";
import { useFormEffect } from "@/hooks/use-form-effect";
import { cn } from "@/lib/utils";
import { createApplication } from "@/server/modules/applications/application.actions";
import { User } from "@/types";
import { Asset } from "@/types/asset.types";
import { redirect, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";

export default function TransferAssetScreen(props: {
  users: User[];
  assets: Asset[];
}) {
  const { users, assets } = props;
  const router = useRouter();
  const [state, action] = useFormState(createApplication, {
    status: "UNSET",
    message: "",
    timestamp: Date.now(),
  });

  const [selectedAssetId, setSelectedAssetId] = useState<string | undefined>(
    undefined
  );

  const allowedUsers = useMemo(() => {
    if (!selectedAssetId) return users;
    const selectedAsset = assets.find((asset) => asset._id === selectedAssetId);
    return users.filter((user) => user._id !== selectedAsset?.userId);
  }, [selectedAssetId]);

  useFormEffect(state, (changedState) => {
    if (changedState.status === "ERROR") {
      toast.error(changedState.message);
    }
    if (changedState.status === "SUCCESS") {
      toast.success(changedState.message);
      redirect(PAGES.APPLICATIONS);
    }
  });

  // const {} = useForm

  return (
    <main className=" py-10 ">
      <Container>
        <Card className=" mx-auto w-full ">
          <CardHeader className=" space-y-1">
            <CardTitle>Transfer an Asset</CardTitle>
            <CardDescription>Transfer an asset to person</CardDescription>
          </CardHeader>

          <CardContent>
            <form action={action} className="">
              <fieldset className=" grid gap-6 md:grid-cols-2 ">
                <div className="grid gap-3">
                  <Label htmlFor="asset">Asset</Label>

                  <select
                    id="asset"
                    name="asset"
                    className={cn(
                      "w-full border",
                      buttonVariants({ variant: "link" })
                    )}
                    onChange={(e) => {
                      setSelectedAssetId(e.currentTarget.value);
                    }}
                  >
                    <option value={""}>select asset</option>

                    {assets.map((asset, index) => (
                      <option key={asset._id} value={asset._id}>
                        {asset.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="asset">To</Label>

                  <select
                    id="to"
                    name="to"
                    className={cn(
                      "w-full border",
                      buttonVariants({ variant: "link" })
                    )}
                  >
                    <option value={""}>select user</option>

                    {allowedUsers.map((user, index) => (
                      <option key={user._id} value={user._id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-3 col-span-full">
                  <Label htmlFor="reason">Reason (optional)</Label>
                  <Textarea
                    id="reason"
                    name="reason"
                    placeholder="reason for transfer"
                    rows={5}
                    className="min-h-32 resize-none"
                  />
                </div>
              </fieldset>

              <div className=" col-span-full flex justify-end gap-3 pt-5 ">
                <Button
                  variant={"destructive"}
                  onClick={() => router.back()}
                  className=" w-full max-w-[7rem] "
                >
                  Cancel
                </Button>

                <FormButton className=" w-full max-w-[7rem] bg-blue-700 hover:bg-blue-600 ">
                  Confirm
                </FormButton>
              </div>
            </form>
          </CardContent>
        </Card>
      </Container>
    </main>
  );
}
