import { readContractQueryOptions } from "wagmi/query";

import { PIXEL_BOARD_V2_ABI } from "@/shared/lib/contract";
import { config, giwaSepolia } from "@/shared/lib/wagmi";

import type { ContractFunctionArgs, ContractFunctionName } from "viem";

const address = process.env.NEXT_PUBLIC_PIXEL_BOARD_V2_ADDRESS as `0x${string}`;

const abi = PIXEL_BOARD_V2_ABI;

export function contractQueryOptions<
  functionName extends ContractFunctionName<typeof abi, "pure" | "view">,
  args extends ContractFunctionArgs<
    typeof abi,
    "pure" | "view",
    functionName
  > = ContractFunctionArgs<typeof abi, "pure" | "view", functionName>
>({ functionName, args }: { functionName: functionName; args?: args }) {
  return readContractQueryOptions(config, {
    address,
    abi,
    functionName,
    args,
    chainId: giwaSepolia.id,
  });
}
