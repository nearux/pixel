import { useState } from "react";

interface Pixel {
  x: number;
  y: number;
  color: string;
  owner?: string;
  isOwned: boolean;
}

const CANVAS_SIZE = 5;

export function usePixelState() {
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

  const updatePixel = (x: number, y: number, updates: Partial<Pixel>) => {
    setPixels((prevPixels) =>
      prevPixels.map((pixel) =>
        pixel.x === x && pixel.y === y ? { ...pixel, ...updates } : pixel
      )
    );
  };

  const setPixelColor = (
    x: number,
    y: number,
    color: string,
    isOwned: boolean = true
  ) => {
    updatePixel(x, y, { color, isOwned });
  };

  return {
    pixels,
    setPixels,
    updatePixel,
    setPixelColor,
    CANVAS_SIZE,
  };
}
