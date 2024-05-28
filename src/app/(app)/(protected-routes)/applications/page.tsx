import { Container } from "@/components/container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PAGES } from "@/data/page-map";
import {
  getAllApplications,
  getUserApplications,
} from "@/server/modules/applications/application.actions";
import { getLoggedInUser } from "@/server/modules/auth/auth.actions";
import { redirect } from "next/navigation";
import ApplicationsTable from "../dashboard/applications-table";
import { FullApplication } from "@/types/application.types";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default async function ViewApplicationsPage() {
  const user = await getLoggedInUser();
  if (!user) redirect(PAGES.HOME);

  let applications: FullApplication[];
  if (user.role === "admin") {
    applications = await getAllApplications({ status: "Pending" });
  } else {
    applications = await getUserApplications(user._id, { status: "Pending" });
  }

  return (
    <main className=" py-10 ">
      <Container className=" space-y-5 ">
        <div className=" flex justify-end ">
          <Link
            href={PAGES.CREATE_APPLICATION}
            className={cn(buttonVariants({}), " bg-blue-700 hover:bg-blue-600")}
          >
            Transfer Asset
          </Link>
        </div>

        <Card>
          <CardHeader className="px-7">
            <div className=" space-y-1 ">
              <CardTitle>Transfer Applications</CardTitle>
              <CardDescription>
                All transfer applications will appear here
              </CardDescription>
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
              <ApplicationsTable applications={applications} role={user.role} />
            )}
          </CardContent>
        </Card>
      </Container>
    </main>
  );
}
