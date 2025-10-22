"use client";

import { useRef, useState } from "react";

import { useAccount } from "wagmi";

import {
  useCanvasInteraction,
  usePixelState,
  useCanvasZoom,
  useInitCanvasDrawing,
} from "../hooks";
import { PixelPurchaseModal } from "./PixelPurchaseModal";

export function PixelCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isConnected } = useAccount();
  const [selectedPixel, setSelectedPixel] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const { pixels, isLoading, refreshPixels, getPixel, CANVAS_SIZE } =
    usePixelState();
  const { zoom, pan, handleWheel, updatePan } = useCanvasZoom();

  const {
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    // handleCanvasClick: originalHandleCanvasClick,
  } = useCanvasInteraction({
    canvasRef,
    zoom,
    pan,
    CANVAS_SIZE,
    setPixelColor: () => {}, // 더 이상 사용하지 않음
    updatePan,
  });

  // 픽셀 클릭 핸들러
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = Math.floor(
      (event.clientX - rect.left) / (rect.width / CANVAS_SIZE)
    );
    const y = Math.floor(
      (event.clientY - rect.top) / (rect.height / CANVAS_SIZE)
    );

    if (x >= 0 && x < CANVAS_SIZE && y >= 0 && y < CANVAS_SIZE) {
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

        setSelectedPixel({ x, y });
        setShowPurchaseModal(true);
      }
    }
  };

  const handlePurchaseSuccess = () => {
    setShowPurchaseModal(false);
    setSelectedPixel(null);
    refreshPixels(); // 블록체인 데이터 새로고침
  };

  useInitCanvasDrawing({
    canvasRef,
    pixels,
    zoom,
    pan,
    CANVAS_SIZE,
  });

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-gray-600">픽셀 데이터를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-4 text-sm text-gray-600">
        <p>• 빈 픽셀을 클릭하면 구매할 수 있습니다</p>
        <p>• 소유된 픽셀을 클릭하면 링크로 이동합니다</p>
        <p>• 가격: 0.00000001 ETH</p>
      </div>

      <div
        className="border-2 border-gray-300 rounded-lg bg-zinc-50 w-full h-full"
        onWheel={handleWheel}
      >
        <canvas
          ref={canvasRef}
          className={`w-full h-full image-rendering-pixelated ${
            isDragging ? "cursor-grabbing" : "cursor-crosshair"
          }`}
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>

      {showPurchaseModal && selectedPixel && (
        <PixelPurchaseModal
          isOpen={showPurchaseModal}
          onClose={() => setShowPurchaseModal(false)}
          x={selectedPixel.x}
          y={selectedPixel.y}
          onSuccess={handlePurchaseSuccess}
        />
      )}
    </div>
  );
}
