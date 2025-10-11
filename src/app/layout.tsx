import type { Metadata } from "next";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";
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
      <body
        className={cn(
          pretendard.variable,
          "font-pretendard antialiased bg-zinc-900"
        )}
      >
        {children}
      </body>
    </html>
  );
}
