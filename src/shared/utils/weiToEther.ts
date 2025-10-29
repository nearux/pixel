import { formatEther } from "viem";

export function weiToEther(weiValue: string | bigint | number): string {
  const bigIntValue =
    typeof weiValue === "bigint" ? weiValue : BigInt(weiValue);

  return formatEther(bigIntValue);
}
