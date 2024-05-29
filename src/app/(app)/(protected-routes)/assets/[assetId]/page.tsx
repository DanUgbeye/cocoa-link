import { Container } from "@/components/container";
import FormButton from "@/components/form-button";
import RoundProgressBar from "@/components/round-progress-bar";
import ActivityTable from "@/components/tables/activity-table";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PAGES } from "@/data/page-map";
import { cn } from "@/lib/utils";
import { getAssetActivities } from "@/server/modules/activity/activity.actions";
import { getAsset } from "@/server/modules/asset/asset.actions";
import { getLoggedInUser } from "@/server/modules/auth/auth.actions";
import { Pencil, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import ViewAssetScreen from "./screen";

export default async function ViewAssetDetailsPage(props: {
  params: { assetId: string };
}) {
  const {
    params: { assetId },
  } = props;

  const user = await getLoggedInUser();
  if (!user) redirect(PAGES.HOME);

  const asset = await getAsset(assetId);
  if (!asset) {
    return (
      <div className=" px-10 py-10 text-4xl ">
        <center>Asset Not Found</center>
      </div>
    );
  }

  const assetActivities = await getAssetActivities(assetId);

  return <ViewAssetScreen asset={asset} activities={assetActivities} />;
}
