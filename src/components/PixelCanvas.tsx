"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Pixel {
  x: number;
  y: number;
  color: string;
  owner?: string;
  isOwned: boolean;
}

const CANVAS_SIZE = 5;
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 10;
const ZOOM_STEP = 0.1;

export function PixelCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [zoom, setZoom] = useState(1);

  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hasDragged, setHasDragged] = useState(false);

  const [pixels, setPixels] = useState<Pixel[]>(() => {
    const initialPixels: Pixel[] = [];
    for (let x = 0; x < CANVAS_SIZE; x++) {
      for (let y = 0; y < CANVAS_SIZE; y++) {
        initialPixels.push({
          x,
          y,
          color: "#FFFFFF",
          isOwned: false,
        });
      }
    }
    return initialPixels;
  });

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (event.button === 0) {
        setIsDragging(true);
        setHasDragged(false);
        setDragStart({ x: event.clientX, y: event.clientY });
      }
    },
    []
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (isDragging) {
        const deltaX = event.clientX - dragStart.x;
        const deltaY = event.clientY - dragStart.y;

        const dragDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (dragDistance > 5) {
          setHasDragged(true);
        }

        setPan((prev) => ({
          x: prev.x + deltaX,
          y: prev.y + deltaY,
        }));

        setDragStart({ x: event.clientX, y: event.clientY });
      }
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((event: React.WheelEvent) => {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    setZoom((prev) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev + delta)));
  }, []);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;

    const pixelSize =
      Math.min(canvasWidth / CANVAS_SIZE, canvasHeight / CANVAS_SIZE) * zoom;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;
    ctx.scale(dpr, dpr);

    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    ctx.fillStyle = "#E5E7EB";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    const offsetX = (canvasWidth - CANVAS_SIZE * pixelSize) / 2 + pan.x;
    const offsetY = (canvasHeight - CANVAS_SIZE * pixelSize) / 2 + pan.y;

    // 그리드 라인 그리기
    ctx.strokeStyle = "#9CA3AF";
    ctx.lineWidth = 1;

    for (let i = 0; i <= CANVAS_SIZE; i++) {
      const x = offsetX + i * pixelSize;
      const y = offsetY + i * pixelSize;

      // 세로선
      ctx.beginPath();
      ctx.moveTo(x, offsetY);
      ctx.lineTo(x, offsetY + CANVAS_SIZE * pixelSize);
      ctx.stroke();

      // 가로선
      ctx.beginPath();
      ctx.moveTo(offsetX, y);
      ctx.lineTo(offsetX + CANVAS_SIZE * pixelSize, y);
      ctx.stroke();
    }

    pixels.forEach((pixel) => {
      const x = offsetX + pixel.x * pixelSize;
      const y = offsetY + pixel.y * pixelSize;

      //   ctx.fillStyle = pixel.color;
      //   ctx.fillRect(x, y, pixelSize, pixelSize);

      if (pixel.isOwned) {
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = Math.max(1, zoom * 0.5);
        ctx.strokeRect(x, y, pixelSize, pixelSize);
      }
    });
  }, [pixels, zoom, pan]);

  const handleCanvasClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (hasDragged) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const canvasWidth = canvas.clientWidth;
      const canvasHeight = canvas.clientHeight;

      const pixelSize =
        Math.min(canvasWidth / CANVAS_SIZE, canvasHeight / CANVAS_SIZE) * zoom;

      const offsetX = (canvasWidth - CANVAS_SIZE * pixelSize) / 2 + pan.x;
      const offsetY = (canvasHeight - CANVAS_SIZE * pixelSize) / 2 + pan.y;

      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;

      const x = Math.floor((clickX - offsetX) / pixelSize);
      const y = Math.floor((clickY - offsetY) / pixelSize);

      if (x >= 0 && x < CANVAS_SIZE && y >= 0 && y < CANVAS_SIZE) {
        setPixels((prevPixels) =>
          prevPixels.map((pixel) =>
            pixel.x === x && pixel.y === y
              ? { ...pixel, color: "#000000", isOwned: true }
              : pixel
          )
        );
      }
    },
    [zoom, pan, hasDragged]
  );

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  return (
    <div className="w-full h-full flex flex-col">
      <div
        className="border-2 border-gray-300 rounded-lg bg-zinc-50 w-full h-full"
        onWheel={handleWheel}
      >
        <canvas
          ref={canvasRef}
          className={`w-full h-full ${
            isDragging ? "cursor-grabbing" : "cursor-crosshair"
          }`}
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ imageRendering: "pixelated" }}
        />
      </div>
    </div>
  );
}
