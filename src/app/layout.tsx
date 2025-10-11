import localFont from "next/font/local";

import Header from "@/components/Header";
import { cn } from "@/lib/utils";

import Provider from "./Provider";

import type { Metadata } from "next";

import "./globals.css";

const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "300 900",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "Pixel",
  description: "Pixel is on-chain trading platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </head>
      <body
        className={cn(
          pretendard.variable,
          "font-pretendard antialiased bg-zinc-900 h-screen"
        )}
        style={{ touchAction: "none" }}
      >
        <Provider>
          <div className="h-screen flex flex-col">
            <Header />
            <div className="flex-1 overflow-hidden touch-none">{children}</div>
          </div>
        </Provider>
      </body>
    </html>
  );
}
