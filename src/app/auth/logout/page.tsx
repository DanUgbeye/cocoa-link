import LogoutScreen from "./screen";

export default function LogoutPage({
  searchParams,
}: {
  searchParams: { redirect?: string };
}) {
  return <LogoutScreen redirect={searchParams.redirect} />;
}
