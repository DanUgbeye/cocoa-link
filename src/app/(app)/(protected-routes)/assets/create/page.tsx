import { getLoggedInUser } from "@/server/modules/auth/auth.actions";
import CreateAssetScreen from "./screen";
import { redirect } from "next/navigation";
import { PAGES } from "@/data/page-map";

export default async function CreateAssetPage() {
  const user = await getLoggedInUser();

  if (!user || user.role === "admin") {
    redirect(PAGES.DASHBOARD);
  }

  return <CreateAssetScreen />;
}
