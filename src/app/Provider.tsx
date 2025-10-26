"use client";

import { PropsWithChildren } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { WagmiProvider } from "wagmi";

import { OverlayProvider } from "@/shared/hooks/useOverlay/OverlayProvider";
import { config } from "@/shared/lib/wagmi";

const client = new QueryClient();

export default function Provider({ children }: PropsWithChildren) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <OverlayProvider>{children}</OverlayProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
