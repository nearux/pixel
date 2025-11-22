import { useState, useEffect } from "react";

import { Pixel, type ContractPixel } from "@/shared/lib/contract";

import { useAllPixels } from "./usePixelContract";

function convertPixelDataToPixel(
  pixelData: ContractPixel,
  pixelIndex: number
): Pixel {
  return {
    pixelIndex,
    owner: pixelData?.owner || "",
    metadataCid: pixelData?.metadataCid || "",
    isOwned: pixelData?.isOwned || false,
    purchaseTime: pixelData?.purchaseTime || BigInt(0),
  };
}

export function usePixelState() {
  const {
    pixels: blockchainPixels,
    isLoading,
    error,
    refetch,
  } = useAllPixels();

  const [pixels, setPixels] = useState<Pixel[]>([]);

  useEffect(() => {
    if (blockchainPixels) {
      const convertedPixels = blockchainPixels.map((blockchainPixel, index) =>
        convertPixelDataToPixel(blockchainPixel, index)
      );

      setPixels(convertedPixels);
    }
  }, [blockchainPixels]);

  const getPixel = (pixelIndex: number): Pixel | undefined => {
    return pixels.find((pixel) => pixel.pixelIndex === pixelIndex);
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
