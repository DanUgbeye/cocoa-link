import { Container } from "@/components/container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UsersTable from "@/components/users-table";
import { PAGES } from "@/data/page-map";
import { getLoggedInUser } from "@/server/modules/auth/auth.actions";
import { getAllUsers } from "@/server/modules/user/user.actions";
import { redirect } from "next/navigation";

export default async function ViewUsersPage() {
  const user = await getLoggedInUser();
  if (!user) redirect(PAGES.HOME);
  if (user.role !== "admin") redirect(PAGES.DASHBOARD);
  const users = await getAllUsers();

  return (
    <main className=" py-10 ">
      <Container>
        <Card>
          <CardHeader className="px-7">
            <CardTitle>Users</CardTitle>
            <CardDescription>All registered users</CardDescription>
          </CardHeader>

          <CardContent>
            {users.length <= 0 ? (
              <>
                <div className=" py-10 text-center ">
                  There are no registered users
                </div>
              </>
            ) : (
              <UsersTable users={users} />
            )}
          </CardContent>
        </Card>
      </Container>
    </main>
  );
}
