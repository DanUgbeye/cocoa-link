import { Metadata, Viewport } from "next";
import { Inter as FontSans } from "next/font/google";
import React from "react";
import "./globals.css";
import Providers from "./providers";
import { cn } from "@/lib/utils";
import { verifyAuth } from "@/server/modules/auth/auth.actions";
import { redirect } from "next/navigation";
import { PAGES } from "@/data/page-map";

export const metadata: Metadata = {
  title: "FAMIS",
  description: "Fixed Assets Maagement System",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export interface RootLayoutProps extends React.PropsWithChildren {}

export default function RootLayout(props: RootLayoutProps) {
  const { children } = props;

  return (
    <html lang="en" className=" bg-neutral-100 ">
      <body
        className={cn(
          "bg-background min-h-screen font-sans antialiased",
          fontSans.variable
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
