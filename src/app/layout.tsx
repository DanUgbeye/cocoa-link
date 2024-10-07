import StoreProvider from "@/app/store-provider";
import { cn } from "@/lib/utils";
import { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import React from "react";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Cocoa Link",
  description: "Marketplace for connecting Cocoa Farmers and Industries",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export interface RootLayoutProps extends React.PropsWithChildren {}

export default function RootLayout(props: RootLayoutProps) {
  const { children } = props;

  return (
    <html lang="en" className="bg-neutral-100">
      <body
        className={cn(
          "min-h-screen font-montserrat antialiased",
          montserrat.variable
        )}
      >
        <StoreProvider>
          <Providers>{children}</Providers>
        </StoreProvider>
      </body>
    </html>
  );
}
