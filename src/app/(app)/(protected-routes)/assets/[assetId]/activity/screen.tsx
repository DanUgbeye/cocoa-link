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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PAGES } from "@/data/page-map";
import { useFormEffect } from "@/hooks/use-form-effect";
import { cn } from "@/lib/utils";
import { createActivity } from "@/server/modules/activity/activity.actions";
import { redirect, useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";

export default function CreateActivityScreen(props: { assetId: string }) {
  const { assetId } = props;
  const router = useRouter();
  const [state, action] = useFormState(createActivity, {
    status: "UNSET",
    message: "",
    timestamp: Date.now(),
  });

  useFormEffect(state, (changedState) => {
    if (changedState.status === "ERROR") {
      toast.error(changedState.message);
    }
    if (changedState.status === "SUCCESS") {
      toast.success(changedState.message);
      redirect(`${PAGES.ASSETS}/${assetId}`);
    }
  });

  return (
    <main className=" py-10 ">
      <Container>
        <Card className=" mx-auto w-full max-w-xl ">
          <CardHeader>
            <CardTitle>Record Activity</CardTitle>
            <CardDescription>Add a new activity to an asset</CardDescription>
          </CardHeader>

          <CardContent>
            <form action={action} className="grid gap-6 ">
              <fieldset className=" space-y-6">
                <input
                  id="asset"
                  name="asset"
                  type="text"
                  className=" hidden "
                  defaultValue={assetId}
                />
                <div className="grid gap-3">
                  <Label htmlFor="type">Activity Type</Label>

                  <select
                    id="type"
                    name="type"
                    className={cn(
                      "w-full border",
                      buttonVariants({ variant: "link" })
                    )}
                    onChange={(e) => {
                      // setSelectedAssetId(e.currentTarget.value);
                    }}
                  >
                    <option value={""}>select activity</option>

                    {[
                      "Damage",
                      "Repair",
                      "Upgrade",
                      "Maintenance",
                      // "Purchase",
                      "Inspection",
                      "Sale",
                      // "Transfer",
                    ].map((activityType, index) => (
                      <option key={activityType} value={activityType}>
                        {activityType}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    className="w-full"
                    placeholder="activity date"
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    className="w-full"
                    placeholder="activity acquisition date"
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
                  Save
                </FormButton>
              </div>
            </form>
          </CardContent>
        </Card>
      </Container>
    </main>
  );
}
