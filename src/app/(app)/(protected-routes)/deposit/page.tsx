import { Container } from "@/components/container";
import { PAGES } from "@/data/page-map";
import { getLoggedInUser } from "@/server/modules/auth/auth.actions";
import { redirect } from "next/navigation";

export default async function DepositPage() {
  const user = await getLoggedInUser();
  if (!user) redirect(PAGES.LOGIN);

  return <Container className="py-10">Deposit</Container>;
}
