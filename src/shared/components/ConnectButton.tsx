"use client";

import { BiLogOut } from "react-icons/bi";
import { FaUser } from "react-icons/fa";
import { FiCopy } from "react-icons/fi";
import { useAccount, useConnect, useDisconnect } from "wagmi";

import { Button } from "./Button";
import { Tooltip, TooltipTrigger, TooltipContent } from "./Tooltip";

export const ConnectButton = () => {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const copyAddress = async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address);
      } catch (err) {
        console.error("Failed to copy address:", err);
      }
    }
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <FaUser size={18} />
          </TooltipTrigger>
          <TooltipContent className="flex items-center gap-2">
            <p>{address}</p>
            <FiCopy
              size={14}
              className="cursor-pointer hover:opacity-70 transition-opacity"
              onClick={copyAddress}
            />
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <BiLogOut
              className="cursor-pointer hover:opacity-70 transition-opacity"
              size={24}
              onClick={() => disconnect()}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Disconnect</p>
          </TooltipContent>
        </Tooltip>
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
          {isPending ? "Connecting..." : `${connector.name} Connect`}
        </Button>
      ))}
    </div>
  );
};
