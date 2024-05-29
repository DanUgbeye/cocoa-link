import { getLoggedInUser } from "@/server/modules/auth/auth.actions";
import CreateActivityScreen from "./screen";
import { redirect } from "next/navigation";
import { PAGES } from "@/data/page-map";

export default async function CreateActivityPage(props: {
  params: { assetId: string };
}) {
  const {
    params: { assetId },
  } = props;
  const user = await getLoggedInUser();

  if (!user || user.role === "admin") {
    redirect(PAGES.DASHBOARD);
  }

  return <CreateActivityScreen assetId={assetId} />;
}
