"use client";

import { Suspense } from "react";

import { useAccount } from "wagmi";

import { Button } from "@/shared/components/Button";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";
import { toast } from "@/shared/components/Toast/toastManager";
import { useOverlay } from "@/shared/hooks/useOverlay";

import { useAllPixels } from "../hooks";
import Pixel from "./Pixel";
import { PixelPurchaseModal } from "./PixelPurchaseModal";
import { deleteMetadata } from "../api/deleteMetadata";

import type { FallbackProps } from "react-error-boundary";

export function PixelBoard() {
  return (
    <ErrorBoundary
      errorFallback={(props) => <PixelBoardContent.ErrorFallback {...props} />}
    >
      <Suspense fallback={<PixelBoardContent.Fallback />}>
        <PixelBoardContent />
      </Suspense>
    </ErrorBoundary>
  );
}

function PixelBoardContent() {
  const overlay = useOverlay();
  const { isConnected, address } = useAccount();

  const { pixels, getPixel, refreshPixels } = useAllPixels();

  const handlePixelPurchase = (pixelId: bigint, metadataCid?: string) => {
    if (!isConnected) {
      toast.error("Please connect your wallet.");
      return;
    }

    overlay.open(({ isOpen, close }) => (
      <PixelPurchaseModal
        isOpen={isOpen}
        onClose={close}
        pixelId={pixelId}
        onSuccess={async () => {
          refreshPixels();

          if (metadataCid) {
            deleteMetadata(metadataCid);
          }
        }}
      />
    ));
  };

  const handlePixelClick = (pixelId: bigint, url?: string) => {
    const pixel = getPixel(pixelId);

    if (pixel?.isOwned) {
      if (pixel.metadataCid) {
        window.open(url, "_blank");
      }
    } else {
      handlePixelPurchase(pixelId);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="overflow-auto p-4">
        <div className="grid grid-cols-3 gap-2 w-fit mx-auto">
          {pixels?.map((pixel) =>
            pixel.isOwned ? (
              <ErrorBoundary
                key={pixel.id}
                errorFallback={(props) => <Pixel.ErrorFallback {...props} />}
              >
                <Suspense fallback={<Pixel.Fallback />}>
                  <Pixel
                    pixel={pixel}
                    isOwnedByCurrentUser={
                      address?.toLowerCase() === pixel.owner?.toLowerCase()
                    }
                    onClick={handlePixelClick}
                    handlePixelPurchase={handlePixelPurchase}
                  />
                </Suspense>
              </ErrorBoundary>
            ) : (
              <Pixel.Empty
                key={pixel.id}
                pixel={pixel}
                onClick={handlePixelClick}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}

PixelBoardContent.ErrorFallback = ({ resetErrorBoundary }: FallbackProps) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <div className="text-red-500 text-center">
        <p className="font-bold mb-2">Failed to load pixel data</p>
      </div>
      <Button onClick={() => resetErrorBoundary()}>Retry</Button>
    </div>
  );
};

PixelBoardContent.Fallback = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-gray-600">Loading pixel data...</div>
    </div>
  );
};
