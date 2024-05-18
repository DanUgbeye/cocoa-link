import { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import React from "react";
import "./globals.css";
import Providers from "./providers";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "FAMIS",
  description: "Fixed Assets Maagement System",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export interface RootLayoutProps extends React.PropsWithChildren {}

export default function RootLayout(props: RootLayoutProps) {
  const { children } = props;

  return (
    <html lang="en">
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
