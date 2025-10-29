import React from "react";

import Image from "next/image";

import { type Pixel as PixelType } from "../hooks/usePixelState";

interface Props {
  pixel?: PixelType;
  isOwnedByCurrentUser: boolean;
  onClick: (pixelIndex: number) => void;
}

export const Pixel = ({ pixel, isOwnedByCurrentUser, onClick }: Props) => {
  return (
    <div
      key={`${pixel?.pixelIndex}`}
      className={
        "group aspect-square border-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg w-40 bg-gray-100 border-gray-300 hover:bg-gray-200"
      }
      onClick={() => onClick(pixel?.pixelIndex ?? 0)}
    >
      <div className="w-full h-full flex flex-col items-center justify-center p-2 relative">
        {pixel?.isOwned ? (
          <>
            <Image
              src={`${pixel.imageUrl}`}
              alt={pixel.text}
              width={100}
              height={100}
              className="object-cover rounded"
            />
            {!isOwnedByCurrentUser && (
              <span className="absolute bottom-2 right-2 text-xs font-medium text-white bg-black/60 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                Buy
              </span>
            )}
          </>
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
