import { Container } from "@/components/container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserAssets } from "@/server/modules/asset/asset.actions";
import AssetsTable from "./assets-table";

export default async function UserDashboardPage(props: { userId: string }) {
  const { userId } = props;
  const assets = await getUserAssets(userId);
  const activeAssets = assets.filter((asset) => asset.status !== "Sold");

  return (
    <main className=" py-10 ">
      <Container>
        <Card>
          <CardHeader className="px-7">
            <CardTitle>Assets</CardTitle>
            <CardDescription>All available assets</CardDescription>
          </CardHeader>

          <CardContent>
            {activeAssets.length <= 0 ? (
              <>
                <div className=" py-10 text-center ">
                  There are no available assets
                </div>
              </>
            ) : (
              <AssetsTable assets={activeAssets} />
            )}
          </CardContent>
        </Card>
      </Container>
    </main>
  );
}
