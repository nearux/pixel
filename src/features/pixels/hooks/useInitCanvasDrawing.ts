import { useCallback, useEffect } from "react";

interface Pixel {
  x: number;
  y: number;
  color: string;
  owner?: string;
  isOwned: boolean;
}

interface CanvasDrawingProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  pixels: Pixel[];
  zoom: number;
  pan: { x: number; y: number };
  CANVAS_SIZE: number;
}

export function useInitCanvasDrawing({
  canvasRef,
  pixels,
  zoom,
  pan,
  CANVAS_SIZE,
}: CanvasDrawingProps) {
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

      if (pixel.isOwned) {
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = Math.max(1, zoom * 0.5);
        ctx.strokeRect(x, y, pixelSize, pixelSize);
      }
    });
  }, [pixels, zoom, pan, CANVAS_SIZE]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);
}
