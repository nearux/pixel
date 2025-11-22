import React from "react";

import Image from "next/image";

import { FallbackProps } from "react-error-boundary";

import { Button } from "@/shared/components/Button";
import { ContractPixel } from "@/shared/lib/contract";

import { usePixelMetadata } from "../hooks";

interface Props {
  pixel: ContractPixel;
  isOwnedByCurrentUser: boolean;
  onClick: (pixelId: bigint, url: string) => void;
  handlePixelPurchase: (pixelId: bigint) => void;
}

export const Pixel = ({
  pixel,
  isOwnedByCurrentUser,
  onClick,
  handlePixelPurchase,
}: Props) => {
  const { data: metadata } = usePixelMetadata(pixel.metadataCid);

  return (
    <div
      key={`${pixel.id}`}
      className={
        "group aspect-square border-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg w-40 bg-gray-100 border-gray-300 hover:bg-gray-200"
      }
      onClick={() => onClick(pixel.id, metadata.link)}
    >
      <div className="w-full h-full flex flex-col items-center justify-center p-2 relative">
        <Image
          src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${metadata.imageCid}`}
          alt={metadata.text || "Pixel image"}
          width={140}
          height={140}
          className="object-cover rounded"
        />
        {!isOwnedByCurrentUser && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              handlePixelPurchase(pixel.id);
            }}
            className="absolute bottom-2 right-2 text-xs font-medium text-white bg-black/60 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
          >
            Purchase
          </span>
        )}
      </div>
    </div>
  );
};

Pixel.Fallback = () => {
  return (
    <div
      className={
        "group aspect-square border-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg w-40 bg-gray-100 border-gray-300 hover:bg-gray-200 animate-pulse"
      }
    >
      <div className="w-full h-full flex flex-col items-center justify-center p-2 relative"></div>
    </div>
  );
};

Pixel.ErrorFallback = ({ resetErrorBoundary }: FallbackProps) => {
  return (
    <div
      className={
        "group aspect-square border-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg w-40 bg-gray-100 border-gray-300 hover:bg-gray-200"
      }
    >
      <div className="w-full h-full flex flex-col items-center justify-center p-2 relative">
        <Button onClick={() => resetErrorBoundary()}>Retry</Button>
      </div>
    </div>
  );
};

Pixel.Empty = ({
  pixel,
  onClick,
}: {
  pixel: ContractPixel;
  onClick: (pixelId: bigint, url?: string) => void;
}) => {
  return (
    <div
      key={`${pixel.id}`}
      className={
        "group aspect-square border-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg w-40 bg-gray-100 border-gray-300 hover:bg-gray-200"
      }
      onClick={() => onClick(pixel.id)}
    >
      <div className="w-full h-full flex flex-col items-center justify-center p-2 relative">
        <div className="text-xs text-gray-400" />
      </div>
    </div>
  );
};

Pixel.displayName = "Pixel";

export default Pixel;
