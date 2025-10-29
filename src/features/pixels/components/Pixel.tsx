import React from "react";

import { type Pixel as PixelType } from "../hooks/usePixelState";

interface Props {
  pixel?: PixelType;
  onClick: (pixelIndex: number) => void;
}

export const Pixel = ({ pixel, onClick }: Props) => {
  return (
    <div
      key={`${pixel?.pixelIndex}`}
      className={`
    aspect-square border-2 rounded-lg cursor-pointer transition-all duration-200
    hover:scale-105 hover:shadow-lg w-40
    ${
      pixel?.isOwned
        ? "bg-yellow-100 border-yellow-400 hover:bg-yellow-200"
        : "bg-gray-100 border-gray-300 hover:bg-gray-200"
    }
  `}
      onClick={() => onClick(pixel?.pixelIndex ?? 0)}
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
          <EmptyPixel />
        )}
      </div>
    </div>
  );
};

const EmptyPixel = () => {
  return <div className="text-xs text-gray-400" />;
};

export default Pixel;
