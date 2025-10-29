import { useState, useEffect } from "react";

import { useAllPixels } from "./usePixelContract";

export interface Pixel {
  pixelIndex: number;
  text: string;
  link: string;
  owner: string;
  isOwned: boolean;
  purchaseTime: number;
}

export function usePixelState() {
  const { pixels: blockchainPixels, isLoading, refetch } = useAllPixels();
  const [localPixels, setLocalPixels] = useState<Pixel[]>([]);

  useEffect(() => {
    if (blockchainPixels) {
      const convertedPixels: Pixel[] = [];

      for (let x = 0; x < blockchainPixels.length; x++) {
        const blockchainPixel = blockchainPixels[x];

        convertedPixels.push({
          pixelIndex: x,
          text: blockchainPixel?.text || "",
          link: blockchainPixel?.link || "",
          owner: blockchainPixel?.owner || "",
          isOwned: blockchainPixel?.isOwned || false,
          purchaseTime: blockchainPixel?.purchaseTime
            ? Number(blockchainPixel.purchaseTime)
            : 0,
        });
      }

      setLocalPixels(convertedPixels);
    }
  }, [blockchainPixels]);

  const getPixel = (pixelIndex: number): Pixel | undefined => {
    return localPixels.find((pixel) => pixel.pixelIndex === pixelIndex);
  };

  const refreshPixels = () => {
    refetch();
  };

  return {
    pixels: localPixels,
    isLoading,
    refreshPixels,
    getPixel,
  };
}
