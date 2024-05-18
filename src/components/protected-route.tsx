import React from "react";

export interface ProtectedRouteProps extends React.PropsWithChildren {
  redirectPath?: string;
}

export default async function ProtectedRoute(props: ProtectedRouteProps) {
  // TODO check auth cookie

  return <>{props.children}</>;
}
