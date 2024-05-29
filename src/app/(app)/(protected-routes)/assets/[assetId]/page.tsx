import { PAGES } from "@/data/page-map";
import { getAssetActivities } from "@/server/modules/activity/activity.actions";
import { getAsset } from "@/server/modules/asset/asset.actions";
import { getLoggedInUser } from "@/server/modules/auth/auth.actions";
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
  const assetActivities = asset ? await getAssetActivities(assetId) : [];

  return <ViewAssetScreen asset={asset} activities={assetActivities} />;
}
