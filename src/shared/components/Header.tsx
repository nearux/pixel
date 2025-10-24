"use client";

import React from "react";

import Image from "next/image";

import { ConnectButton } from "./ConnectButton";

export function Header() {
  return (
    <div className="flex justify-between items-center py-4 px-8 bg-white shadow-sm flex-shrink-0">
      <Image src="/images/logo.png" alt="logo" width={40} height={40} />
      <ConnectButton />
    </div>
  );
}
