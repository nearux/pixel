"use client";

import React from "react";

import { ConnectButton } from "./ConnectButton";

export default function Header() {
  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-sm flex-shrink-0">
      <h1 className="text-2xl font-bold text-gray-800">Pixel</h1>
      <ConnectButton />
    </div>
  );
}
