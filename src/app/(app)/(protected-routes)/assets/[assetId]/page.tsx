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
  if (!asset) {
    return (
      <div className=" px-10 py-10 text-4xl font-semibold text-amber-600 ">
        <center>Asset Not Found!</center>
      </div>
    );
  }

  const assetActivities = await getAssetActivities(assetId);
  
  return <ViewAssetScreen asset={asset} activities={assetActivities} />;
}
