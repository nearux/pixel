"use client";

import { useRef } from "react";

import {
  useCanvasInteraction,
  usePixelState,
  useCanvasZoom,
  useInitCanvasDrawing,
} from "../hooks";

export function PixelCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { pixels, setPixelColor, CANVAS_SIZE } = usePixelState();
  const { zoom, pan, handleWheel, updatePan } = useCanvasZoom();

  const {
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleCanvasClick,
  } = useCanvasInteraction({
    canvasRef,
    zoom,
    pan,
    CANVAS_SIZE,
    setPixelColor,
    updatePan,
  });

  useInitCanvasDrawing({
    canvasRef,
    pixels,
    zoom,
    pan,
    CANVAS_SIZE,
  });

  return (
    <div className="w-full h-full flex flex-col">
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
    </div>
  );
}
