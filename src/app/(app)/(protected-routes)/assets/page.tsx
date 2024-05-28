import { PAGES } from "@/data/page-map";
import {
  getAllAssets,
  getUserAssets,
} from "@/server/modules/asset/asset.actions";
import { getLoggedInUser } from "@/server/modules/auth/auth.actions";
import { Asset } from "@/types/asset.types";
import { redirect } from "next/navigation";
import AssetsTable from "../dashboard/assets-table";
import { Container } from "@/components/container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function ViewAssetsPage() {
  const user = await getLoggedInUser();
  if (!user) redirect(PAGES.HOME);

  let assets: Asset[];

  if (user.role === "admin") {
    assets = (await getAllAssets()).filter((asset) => asset.status !== "Sold");
  } else {
    assets = (await getUserAssets(user._id)).filter(
      (asset) => asset.status !== "Sold"
    );
  }

  return (
    <main className=" py-10 ">
      <Container>
        <Card>
          <CardHeader className="px-7">
            <CardTitle>Assets</CardTitle>
            <CardDescription>All available assets</CardDescription>
          </CardHeader>

          <CardContent>
            {assets.length <= 0 ? (
              <>
                <div className=" py-10 text-center ">
                  There are no available assets
                </div>
              </>
            ) : (
              <AssetsTable assets={assets} />
            )}
          </CardContent>
        </Card>
      </Container>
    </main>
  );
}
