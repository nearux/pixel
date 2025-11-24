import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { contractQueryOptions } from "@/features/pixels/api/contractQueryOptions";
import { PixelBoard } from "@/features/pixels/components/PixelBoard";

import getQueryClient from "./getQueryClient";

export default async function Home() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(
    contractQueryOptions({ functionName: "getAllPixels" })
  );

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <PixelBoard />
    </HydrationBoundary>
  );
}
