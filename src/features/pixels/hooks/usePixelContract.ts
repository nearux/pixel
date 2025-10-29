import { parseEther } from "viem";
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";

import { PIXEL_BOARD_ABI, type PixelData } from "@/shared/lib/contract";

const PIXEL_BOARD_ADDRESS = process.env
  .NEXT_PUBLIC_PIXEL_BOARD_ADDRESS as `0x${string}`;

// 픽셀 구매 훅
export function usePurchasePixel() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const purchasePixel = async (
    pixelIndex: number,
    text: string,
    imageUrl: string,
    link: string
  ) => {
    try {
      await writeContract({
        address: PIXEL_BOARD_ADDRESS,
        abi: PIXEL_BOARD_ABI,
        functionName: "purchasePixel",
        args: [BigInt(pixelIndex), text, imageUrl, link],
        value: parseEther("0.00000001"),
      });
    } catch (err) {
      console.error("Failed to purchase pixel:", err);
      throw err;
    }
  };

  return {
    purchasePixel,
    isPending: isPending || isConfirming,
    isSuccess: isConfirmed,
    error,
    hash,
  };
}

export function useGetPixelPrice(pixelIndex: number) {
  const { data: pixelPrice } = useReadContract({
    address: PIXEL_BOARD_ADDRESS,
    abi: PIXEL_BOARD_ABI,
    functionName: "getPixelPrice",
    args: [BigInt(pixelIndex)],
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

  const updatePixel = async (
    pixelIndex: number,
    text: string,
    imageUrl: string,
    link: string
  ) => {
    try {
      await writeContract({
        address: PIXEL_BOARD_ADDRESS,
        abi: PIXEL_BOARD_ABI,
        functionName: "updatePixel",
        args: [BigInt(pixelIndex), text, imageUrl, link],
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
export function usePixel(pixelIndex: number) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: PIXEL_BOARD_ADDRESS,
    abi: PIXEL_BOARD_ABI,
    functionName: "getPixel",
    args: [BigInt(pixelIndex)],
  });

  return {
    pixel: data as PixelData | undefined,
    isLoading,
    error,
    refetch,
  };
}

// 모든 픽셀 조회 훅
export function useAllPixels() {
  const { data, isLoading, error, refetch } = useReadContract({
    address: PIXEL_BOARD_ADDRESS,
    abi: PIXEL_BOARD_ABI,
    functionName: "getAllPixels",
  });

  return {
    pixels: data as PixelData[] | undefined,
    isLoading,
    error,
    refetch,
  };
}

// 컨트랙트 정보 조회 훅
export function useContractInfo() {
  const { data: totalPixels } = useReadContract({
    address: PIXEL_BOARD_ADDRESS,
    abi: PIXEL_BOARD_ABI,
    functionName: "TOTAL_PIXELS",
  });

  const { data: totalPixelsSold } = useReadContract({
    address: PIXEL_BOARD_ADDRESS,
    abi: PIXEL_BOARD_ABI,
    functionName: "totalPixelsSold",
  });

  return {
    totalPixels: totalPixels ? Number(totalPixels) : 9,
    totalPixelsSold: totalPixelsSold ? Number(totalPixelsSold) : 0,
  };
}
