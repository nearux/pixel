import { useSuspenseQuery } from "@tanstack/react-query";

import { type ContractPixel } from "@/shared/lib/contract";

import { contractQueryOptions } from "../api/contractQueryOptions";

export function useAllPixels() {
  const {
    data: pixels,
    refetch,
    error,
  } = useSuspenseQuery(
    contractQueryOptions({
      functionName: "getAllPixels",
    })
  );

  const getPixel = (pixelId: bigint): ContractPixel | undefined => {
    return pixels.find((pixel) => pixel.id === pixelId);
  };

  const refreshPixels = () => {
    refetch();
  };

  return {
    pixels,
    error,
    refreshPixels,
    getPixel,
  };
}
