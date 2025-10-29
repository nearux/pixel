import React from "react";

import Image from "next/image";

import { type Pixel as PixelType } from "../hooks/usePixelState";

interface Props {
  pixel?: PixelType;
  onClick: (pixelIndex: number) => void;
}

export const Pixel = ({ pixel, onClick }: Props) => {
  console.log({ pixel });
  return (
    <div
      key={`${pixel?.pixelIndex}`}
      className={
        "aspect-square border-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg w-40 bg-gray-100 border-gray-300 hover:bg-gray-200"
      }
      onClick={() => onClick(pixel?.pixelIndex ?? 0)}
    >
      <div className="w-full h-full flex flex-col items-center justify-center p-2">
        {pixel?.isOwned ? (
          <Image
            src={`${pixel.imageUrl}`}
            alt={pixel.text}
            width={100}
            height={100}
          />
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
