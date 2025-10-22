"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";

import { Button } from "./Button";

export const ConnectButton = () => {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
        <Button variant="secondary" size="sm" onClick={() => disconnect()}>
          연결 해제
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      {connectors.map((connector) => (
        <Button
          key={connector.uid}
          onClick={() => connect({ connector })}
          disabled={isPending}
        >
          {isPending ? "연결 중..." : `${connector.name} 연결`}
        </Button>
      ))}
    </div>
  );
};
