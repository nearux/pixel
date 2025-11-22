import { type ContractPixel } from "@/shared/lib/contract";

import { useAllPixels } from "./usePixelContract";

export function usePixelState() {
  const { pixels, isLoading, error, refetch } = useAllPixels();

  const getPixel = (pixelId: bigint): ContractPixel | undefined => {
    if (!pixels) return undefined;

    return pixels.find((pixel) => pixel.id === pixelId);
  };

  const refreshPixels = () => {
    refetch();
  };

  return {
    pixels,
    isLoading,
    error,
    refreshPixels,
    getPixel,
  };
}
