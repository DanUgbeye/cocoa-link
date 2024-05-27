import { Container } from "@/components/container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllAssets } from "@/server/modules/asset/asset.actions";
import AssetsTable from "./assets-table";

export default async function AdminDashboardPage(props: { userId: string }) {
  const { userId } = props;
  const assets = await getAllAssets();
  const activeAssets = assets.filter((asset) => asset.status !== "Sold");


  return (
    <main className=" py-10 ">
      <Container>
        <Card x-chunk="dashboard-05-chunk-3">
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
