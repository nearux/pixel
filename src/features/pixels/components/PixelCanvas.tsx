"use client";

import { useAccount } from "wagmi";

import { toast } from "@/shared/components/Toast/toastManager";
import { useOverlay } from "@/shared/hooks/useOverlay";

import { usePixelState } from "../hooks";
import { PixelPurchaseModal } from "./PixelPurchaseModal";

export function PixelCanvas() {
  const overlay = useOverlay();
  const { isConnected } = useAccount();

  const { isLoading, refreshPixels, getPixel, CANVAS_SIZE } = usePixelState();

  // 픽셀 클릭 핸들러
  const handlePixelClick = (x: number, y: number) => {
    const pixel = getPixel(x, y);

    if (pixel?.isOwned) {
      if (pixel.link) {
        window.open(pixel.link, "_blank");
      }
    } else {
      if (!isConnected) {
        toast.error("Please connect your wallet.");
        return;
      }

      overlay.open(({ isOpen, close }) => (
        <PixelPurchaseModal
          isOpen={isOpen}
          onClose={close}
          x={x}
          y={y}
          onSuccess={refreshPixels}
        />
      ));
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
        <div className="grid grid-cols-5 gap-2 w-fit mx-auto">
          {Array.from({ length: CANVAS_SIZE * CANVAS_SIZE }, (_, index) => {
            const x = Math.floor(index / CANVAS_SIZE);
            const y = index % CANVAS_SIZE;
            const pixel = getPixel(x, y);

            return (
              <div
                key={`${x}-${y}`}
                className={`
                  aspect-square border-2 rounded-lg cursor-pointer transition-all duration-200
                  hover:scale-105 hover:shadow-lg
                  ${
                    pixel?.isOwned
                      ? "bg-yellow-100 border-yellow-400 hover:bg-yellow-200"
                      : "bg-gray-100 border-gray-300 hover:bg-gray-200"
                  }
                `}
                onClick={() => handlePixelClick(x, y)}
              >
                <div className="w-full h-full flex flex-col items-center justify-center p-2">
                  {pixel?.isOwned ? (
                    <div className="text-center">
                      {pixel.text && (
                        <div className="text-sm font-medium text-gray-800 mb-1">
                          {pixel.text}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
