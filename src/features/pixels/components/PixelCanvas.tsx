"use client";

import { useAccount } from "wagmi";

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
      // 이미 소유된 픽셀 - 텍스트/링크 표시
      if (pixel.link) {
        window.open(pixel.link, "_blank");
      }
    } else {
      // 소유되지 않은 픽셀 - 구매 모달 표시
      if (!isConnected) {
        alert("지갑을 연결해주세요.");
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
        <div className="text-gray-600">픽셀 데이터를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {/* <div className="mb-4 text-sm text-gray-600">
        <p>• 빈 픽셀을 클릭하면 구매할 수 있습니다</p>
        <p>• 소유된 픽셀을 클릭하면 링크로 이동합니다</p>
        <p>• 가격: 0.00000001 ETH</p>
      </div> */}

      {/* 5x5 그리드 */}
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
