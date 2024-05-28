import { PAGES } from "@/data/page-map";
import {
  getAllAssets,
  getUserAssets,
} from "@/server/modules/asset/asset.actions";
import { getLoggedInUser } from "@/server/modules/auth/auth.actions";
import { getAllUsers } from "@/server/modules/user/user.actions";
import { Asset } from "@/types/asset.types";
import { redirect } from "next/navigation";
import TransferAssetScreen from "./screen";

export default async function TransferAssetPage() {
  const user = await getLoggedInUser();

  if (!user) {
    redirect(PAGES.DASHBOARD);
  }

  const appUsers = await getAllUsers();
  let assets: Asset[];

  if (user.role === "admin") {
    assets = (await getAllAssets()).filter((asset) => asset.status !== "Sold");
  } else {
    assets = (await getUserAssets(user._id)).filter(
      (asset) => asset.status !== "Sold"
    );
  }

  return (
    <TransferAssetScreen
      users={appUsers.filter((appUser) => appUser._id !== user._id)}
      assets={assets}
    />
  );
}
