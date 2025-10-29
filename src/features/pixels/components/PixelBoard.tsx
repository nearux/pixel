"use client";

import { useAccount } from "wagmi";

import { toast } from "@/shared/components/Toast/toastManager";
import { useOverlay } from "@/shared/hooks/useOverlay";

import { usePixelState } from "../hooks";
import Pixel from "./Pixel";
import { PixelPurchaseModal } from "./PixelPurchaseModal";

export function PixelBoard() {
  const overlay = useOverlay();
  const { isConnected, address } = useAccount();

  const { isLoading, refreshPixels, getPixel, pixels } = usePixelState();

  const handlePixelPurchase = (pixelIndex: number) => {
    if (!isConnected) {
      toast.error("Please connect your wallet.");
      return;
    }

    overlay.open(({ isOpen, close }) => (
      <PixelPurchaseModal
        isOpen={isOpen}
        onClose={close}
        pixelIndex={pixelIndex}
        onSuccess={refreshPixels}
      />
    ));
  };

  const handlePixelClick = (pixelIndex: number) => {
    const pixel = getPixel(pixelIndex);

    if (pixel?.isOwned) {
      if (pixel.link) {
        window.open(pixel.link, "_blank");
      }
    } else {
      handlePixelPurchase(pixelIndex);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-gray-600">Loading pixel data...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="overflow-auto p-4">
        <div className="grid grid-cols-3 gap-2 w-fit mx-auto">
          {pixels.map((pixel) => (
            <Pixel
              key={pixel.pixelIndex}
              pixel={pixel}
              isOwnedByCurrentUser={
                address?.toLowerCase() === pixel.owner?.toLowerCase()
              }
              onClick={handlePixelClick}
              handlePixelPurchase={handlePixelPurchase}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
