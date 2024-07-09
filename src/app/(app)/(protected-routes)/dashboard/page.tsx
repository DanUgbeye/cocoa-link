import { PAGES } from "@/data/page-map";
import { getLoggedInUser } from "@/server/modules/auth/auth.actions";
import { USER_ROLES } from "@/types";
import { redirect } from "next/navigation";
import FarmerDashboardPage from "./farmer";
import IndustryDashboardPage from "./industry";

export default async function DashboardPage() {
  const user = await getLoggedInUser();
  if (!user) redirect(PAGES.HOME);

  if (user.role === USER_ROLES.INDUSTRY) {
    return <IndustryDashboardPage userId={user._id} />;
  }

  return <FarmerDashboardPage userId={user._id} />;
}
