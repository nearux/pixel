import { useCallback, useEffect } from "react";

interface Pixel {
  x: number;
  y: number;
  text: string;
  link: string;
  owner: string;
  isOwned: boolean;
  purchaseTime: number;
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

    // 배경색
    ctx.fillStyle = "#F9FAFB";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    const offsetX = (canvasWidth - CANVAS_SIZE * pixelSize) / 2 + pan.x;
    const offsetY = (canvasHeight - CANVAS_SIZE * pixelSize) / 2 + pan.y;

    // 그리드 라인 그리기
    ctx.strokeStyle = "#E5E7EB";
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

    // 픽셀 그리기
    pixels.forEach((pixel) => {
      const x = offsetX + pixel.x * pixelSize;
      const y = offsetY + pixel.y * pixelSize;

      if (pixel.isOwned) {
        // 소유된 픽셀 배경
        ctx.fillStyle = "#FEF3C7"; // 연한 노란색
        ctx.fillRect(x, y, pixelSize, pixelSize);

        // 테두리
        ctx.strokeStyle = "#F59E0B";
        ctx.lineWidth = Math.max(1, zoom * 0.5);
        ctx.strokeRect(x, y, pixelSize, pixelSize);

        // 텍스트 표시
        if (pixel.text && pixelSize > 20) {
          ctx.fillStyle = "#92400E";
          ctx.font = `bold ${Math.max(8, pixelSize * 0.3)}px Arial`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          // 텍스트가 픽셀 크기에 맞도록 조정
          const maxWidth = pixelSize * 0.9;
          let text = pixel.text;

          // 텍스트가 너무 길면 줄임
          if (ctx.measureText(text).width > maxWidth) {
            while (
              ctx.measureText(text + "...").width > maxWidth &&
              text.length > 0
            ) {
              text = text.slice(0, -1);
            }
            text += "...";
          }

          ctx.fillText(text, x + pixelSize / 2, y + pixelSize / 2);
        }

        // 링크 아이콘 표시 (작은 크기일 때)
        if (pixel.link && pixelSize <= 20) {
          ctx.fillStyle = "#3B82F6";
          ctx.font = `${Math.max(6, pixelSize * 0.4)}px Arial`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("🔗", x + pixelSize / 2, y + pixelSize / 2);
        }
      }
    });
  }, [pixels, zoom, pan, CANVAS_SIZE]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);
}
