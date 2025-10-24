"use client";

import React from "react";

import Image from "next/image";

import { ConnectButton } from "./ConnectButton";

export function Header() {
  return (
    <div className="flex justify-between items-center border-0 py-4 px-8 bg-black shadow-2xl flex-shrink-0 rounded-full mx-12 mt-8">
      <Image src="/images/logo.png" alt="logo" width={40} height={40} />
      <ConnectButton />
    </div>
  );
}
