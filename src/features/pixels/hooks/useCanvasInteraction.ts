import { useState, useCallback } from "react";

interface CanvasInteractionProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  zoom: number;
  pan: { x: number; y: number };
  CANVAS_SIZE: number;
  setPixelColor: (
    x: number,
    y: number,
    color: string,
    isOwned?: boolean
  ) => void;
  updatePan: (deltaX: number, deltaY: number) => void;
}

export function useCanvasInteraction({
  canvasRef,
  zoom,
  pan,
  CANVAS_SIZE,
  setPixelColor,
  updatePan,
}: CanvasInteractionProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hasDragged, setHasDragged] = useState(false);

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

        updatePan(deltaX, deltaY);
        setDragStart({ x: event.clientX, y: event.clientY });
      }
    },
    [isDragging, dragStart, updatePan]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

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
        setPixelColor(x, y, "#000000", true);
      }
    },
    [zoom, pan, hasDragged, CANVAS_SIZE, setPixelColor]
  );

  return {
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleCanvasClick,
  };
}
