import { useState, useEffect } from "react";

import { useAllPixels, useContractInfo } from "./usePixelContract";

interface Pixel {
  x: number;
  y: number;
  text: string;
  link: string;
  owner: string;
  isOwned: boolean;
  purchaseTime: number;
}

export function usePixelState() {
  const { pixels: blockchainPixels, isLoading, refetch } = useAllPixels();
  const { canvasSize } = useContractInfo();
  const [localPixels, setLocalPixels] = useState<Pixel[]>([]);

  // 블록체인 데이터를 로컬 상태로 변환
  useEffect(() => {
    if (blockchainPixels) {
      const convertedPixels: Pixel[] = [];

      for (let x = 0; x < canvasSize; x++) {
        for (let y = 0; y < canvasSize; y++) {
          const pixelId = x * canvasSize + y;
          const blockchainPixel = blockchainPixels[pixelId];

          convertedPixels.push({
            x,
            y,
            text: blockchainPixel?.text || "",
            link: blockchainPixel?.link || "",
            owner: blockchainPixel?.owner || "",
            isOwned: blockchainPixel?.isOwned || false,
            purchaseTime: blockchainPixel?.purchaseTime
              ? Number(blockchainPixel.purchaseTime)
              : 0,
          });
        }
      }

      setLocalPixels(convertedPixels);
    }
  }, [blockchainPixels, canvasSize]);

  const getPixel = (x: number, y: number): Pixel | undefined => {
    return localPixels.find((pixel) => pixel.x === x && pixel.y === y);
  };

  const refreshPixels = () => {
    refetch();
  };

  return {
    pixels: localPixels,
    isLoading,
    refreshPixels,
    getPixel,
    CANVAS_SIZE: canvasSize,
  };
}
