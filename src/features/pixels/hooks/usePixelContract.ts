import { parseEther } from "viem";
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";

import { PIXEL_BOARD_V2_ABI } from "@/shared/lib/contract";

const PIXEL_BOARD_ADDRESS = process.env
  .NEXT_PUBLIC_PIXEL_BOARD_V2_ADDRESS as `0x${string}`;

// 픽셀 구매 훅
export function usePurchasePixel() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const purchasePixel = async ({
    pixelId,
    metadataCid,
    price,
  }: {
    pixelId: bigint;
    metadataCid: string;
    price: string;
  }) => {
    if (!metadataCid) {
      throw new Error("Metadata CID is required");
    }

    writeContract({
      address: PIXEL_BOARD_ADDRESS,
      abi: PIXEL_BOARD_V2_ABI,
      functionName: "purchasePixel",
      args: [pixelId, metadataCid],
      value: parseEther(price),
    });
  };

  return {
    purchasePixel,
    isConfirming,
    isPending: isPending || isConfirming,
    isSuccess: isConfirmed,
    error,
    hash,
  };
}

export function useGetPixelPrice(pixelId: bigint) {
  const { data: pixelPrice } = useReadContract({
    address: PIXEL_BOARD_ADDRESS,
    abi: PIXEL_BOARD_V2_ABI,
    functionName: "getPixelPrice",
    args: [pixelId],
    chainId: 91342,
  });

  return pixelPrice ? Number(pixelPrice) : 0;
}

// 픽셀 업데이트 훅
export function useUpdatePixel() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const updatePixel = async (pixelId: number, metadataCid: string) => {
    try {
      await writeContract({
        address: PIXEL_BOARD_ADDRESS,
        abi: PIXEL_BOARD_V2_ABI,
        functionName: "updatePixel",
        args: [BigInt(pixelId), metadataCid],
        chainId: 91342,
      });
    } catch (err) {
      console.error("Failed to update pixel:", err);
      throw err;
    }
  };

  return {
    updatePixel,
    isPending: isPending || isConfirming,
    isSuccess: isConfirmed,
    error,
    hash,
  };
}

// 특정 픽셀 조회 훅
export function usePixel(pixelId: bigint) {
  const {
    data: pixel,
    isLoading,
    error,
    refetch,
  } = useReadContract({
    address: PIXEL_BOARD_ADDRESS,
    abi: PIXEL_BOARD_V2_ABI,
    functionName: "getPixel",
    args: [pixelId],
    chainId: 91342,
  });

  return {
    pixel,
    isLoading,
    error,
    refetch,
  };
}

// 모든 픽셀 조회 훅
export function useAllPixels() {
  const {
    data: pixels,
    isLoading,
    error,
    refetch,
  } = useReadContract({
    address: PIXEL_BOARD_ADDRESS,
    abi: PIXEL_BOARD_V2_ABI,
    functionName: "getAllPixels",
    chainId: 91342,
  });

  return {
    pixels,
    isLoading,
    error,
    refetch,
  };
}

// 컨트랙트 정보 조회 훅
export function useContractInfo() {
  const { data: totalPixels } = useReadContract({
    address: PIXEL_BOARD_ADDRESS,
    abi: PIXEL_BOARD_V2_ABI,
    functionName: "TOTAL_PIXELS",
    chainId: 91342,
  });

  const { data: totalPixelsSold } = useReadContract({
    address: PIXEL_BOARD_ADDRESS,
    abi: PIXEL_BOARD_V2_ABI,
    functionName: "totalPixelsSold",
    chainId: 91342,
  });

  return {
    totalPixels: totalPixels ? Number(totalPixels) : 9,
    totalPixelsSold: totalPixelsSold ? Number(totalPixelsSold) : 0,
  };
}
