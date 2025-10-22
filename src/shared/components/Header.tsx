"use client";

import React from "react";

import { useContractInfo } from "@/features/pixels/hooks";

import { ConnectButton } from "./ConnectButton";

export function Header() {
  const { totalPixelsSold, pixelPrice } = useContractInfo();

  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-sm flex-shrink-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Pixel Canvas</h1>
        <p className="text-sm text-gray-600">
          구매된 픽셀: {totalPixelsSold}/25 | 가격: {pixelPrice} ETH
        </p>
      </div>
      <ConnectButton />
    </div>
  );
}
