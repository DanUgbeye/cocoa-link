import ProtectedRoute from "@/components/protected-route";
import React from "react";

export interface LayoutProps extends React.PropsWithChildren {}

export default function Layout(props: LayoutProps) {
  const { children } = props;

  return <ProtectedRoute>{children}</ProtectedRoute>;
}
