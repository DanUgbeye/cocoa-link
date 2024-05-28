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
import { getLoggedInUser } from "@/server/modules/auth/auth.actions";
import { PAGES } from "@/data/page-map";
import { redirect } from "next/navigation";
import ApplicationsTable from "./applications-table";
import { getAllApplications } from "@/server/modules/applications/application.actions";

export default async function AdminDashboardPage(props: { userId: string }) {
  const { userId } = props;
  const user = await getLoggedInUser();
  if (!user) {
    redirect(PAGES.HOME);
  }
  const assets = await getAllAssets();
  const activeAssets = assets.filter((asset) => asset.status !== "Sold");
  const applications = await getAllApplications({ approved: true });

  return (
    <main className=" py-10 ">
      <Container className=" space-y-10 ">
        <div className=" space-y-1 ">
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            Welcome {user.name}
          </h1>

          <div className=" text-sm text-neutral-400 ">
            Pick up where you left off
          </div>
        </div>

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

        <Card>
          <CardHeader className="px-7">
            <CardTitle>Transfer Applications</CardTitle>
            <CardDescription>
              All transfer applications will appear here
            </CardDescription>
          </CardHeader>

          <CardContent>
            {applications.length <= 0 ? (
              <>
                <div className=" py-10 text-center ">
                  There are no open applications
                </div>
              </>
            ) : (
              <ApplicationsTable applications={applications} role={user.role} />
            )}
          </CardContent>
        </Card>
      </Container>
    </main>
  );
}
