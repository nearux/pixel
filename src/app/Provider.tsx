"use client";

import { PropsWithChildren } from "react";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { WagmiProvider } from "wagmi";

import { OverlayProvider } from "@/shared/hooks/useOverlay/OverlayProvider";
import { config } from "@/shared/lib/wagmi";

import QueryProvider from "./QueryClientProvider";

export default function Provider({ children }: PropsWithChildren) {
  return (
    <WagmiProvider config={config}>
      <QueryProvider>
        <OverlayProvider>{children}</OverlayProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryProvider>
    </WagmiProvider>
  );
}
