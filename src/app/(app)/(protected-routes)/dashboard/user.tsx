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
import { getUserApplications } from "@/server/modules/applications/application.actions";
import { redirect } from "next/navigation";
import { PAGES } from "@/data/page-map";
import { getLoggedInUser } from "@/server/modules/auth/auth.actions";
import ApplicationsTable from "./applications-table";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default async function UserDashboardPage(props: { userId: string }) {
  const { userId } = props;
  const user = await getLoggedInUser();
  if (!user) {
    redirect(PAGES.HOME);
  }
  const assets = await getUserAssets(userId);
  const activeAssets = assets.filter((asset) => asset.status !== "Sold");
  const applications = await getUserApplications(userId, { status: "Pending" });

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
            <div className="flex flex-wrap justify-between gap-4">
              <div className=" space-y-1 ">
                <CardTitle>Assets</CardTitle>
                <CardDescription>All available assets</CardDescription>
              </div>

              <div className=" flex justify-end ">
                <Link
                  href={PAGES.ASSETS}
                  className={cn(
                    buttonVariants({ variant: "link" }),
                    "text-blue-700"
                  )}
                >
                  See all
                </Link>
              </div>
            </div>
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

        {applications.length > 0 && (
          <Card>
            <CardHeader className="px-7">
              <div className="flex flex-wrap justify-between gap-4">
                <div className=" space-y-1 ">
                  <CardTitle>Transfer Applications</CardTitle>
                  <CardDescription>
                    All transfer applications will appear here
                  </CardDescription>
                </div>

                <div className=" flex justify-end ">
                  <Link
                    href={PAGES.APPLICATIONS}
                    className={cn(
                      buttonVariants({ variant: "link" }),
                      "text-blue-700"
                    )}
                  >
                    See all
                  </Link>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {applications.length <= 0 ? (
                <>
                  <div className=" py-10 text-center ">
                    You have no open transfer applications
                  </div>
                </>
              ) : (
                <ApplicationsTable
                  applications={applications}
                  role={user.role}
                />
              )}
            </CardContent>
          </Card>
        )}
      </Container>
    </main>
  );
}
