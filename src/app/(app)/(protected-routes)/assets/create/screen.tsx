"use client";

import { Container } from "@/components/container";
import FormButton from "@/components/form-button";
import { Button } from "@/components/ui/button";
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
import { createAsset } from "@/server/modules/asset/asset.actions";
import { redirect, useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";

export default function CreateAssetScreen() {
  const router = useRouter();
  const [state, action] = useFormState(createAsset, {
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
      redirect(PAGES.ASSETS);
    }
  });

  return (
    <main className=" py-10 ">
      <Container>
        <Card className=" mx-auto w-full ">
          <CardHeader>
            <CardTitle>Add Asset</CardTitle>
            <CardDescription>Add a new asset to the system</CardDescription>
          </CardHeader>

          <CardContent>
            <form action={action} className="grid gap-6 md:grid-cols-2">
              <fieldset className=" space-y-6">
                <div className="grid gap-3">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    className="w-full"
                    placeholder="asset name"
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="asset description"
                    rows={10}
                    className="min-h-32 resize-none"
                  />
                </div>
              </fieldset>

              <fieldset className=" space-y-6">
                <div className="grid gap-3">
                  <Label htmlFor="currentLocation">Location</Label>
                  <Input
                    id="currentLocation"
                    name="currentLocation"
                    type="text"
                    className="w-full"
                    placeholder="asset location"
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="acquisitionDate">Acquisition Date</Label>
                  <Input
                    id="acquisitionDate"
                    name="acquisitionDate"
                    type="date"
                    className="w-full"
                    placeholder="asset acquisition date"
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="depreciationRate">
                    Depreciation Rate (percentage per year)
                  </Label>
                  <Input
                    id="depreciationRate"
                    name="depreciationRate"
                    type="number"
                    step="0.001"
                    className="w-full"
                    placeholder="asset depreciation rate"
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="purchaseCost">Purchase Cost</Label>
                  <Input
                    id="purchaseCost"
                    name="purchaseCost"
                    type="number"
                    className="w-full"
                    placeholder="asset acquisition date"
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
