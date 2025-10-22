import { parseEther } from "viem";
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";

import { PIXEL_CANVAS_ABI, type PixelData } from "@/shared/lib/contract";

const PIXEL_CANVAS_ADDRESS = process.env
  .NEXT_PUBLIC_PIXEL_CANVAS_ADDRESS as `0x${string}`;

// 픽셀 구매 훅
export function usePurchasePixel() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const purchasePixel = async (
    x: number,
    y: number,
    text: string,
    link: string
  ) => {
    try {
      await writeContract({
        address: PIXEL_CANVAS_ADDRESS,
        abi: PIXEL_CANVAS_ABI,
        functionName: "purchasePixel",
        args: [BigInt(x), BigInt(y), text, link],
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

// 픽셀 업데이트 훅
export function useUpdatePixel() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const updatePixel = async (
    x: number,
    y: number,
    text: string,
    link: string
  ) => {
    try {
      await writeContract({
        address: PIXEL_CANVAS_ADDRESS,
        abi: PIXEL_CANVAS_ABI,
        functionName: "updatePixel",
        args: [BigInt(x), BigInt(y), text, link],
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
export function usePixel(x: number, y: number) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: PIXEL_CANVAS_ADDRESS,
    abi: PIXEL_CANVAS_ABI,
    functionName: "getPixel",
    args: [BigInt(x), BigInt(y)],
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
    address: PIXEL_CANVAS_ADDRESS,
    abi: PIXEL_CANVAS_ABI,
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
  const { data: canvasSize } = useReadContract({
    address: PIXEL_CANVAS_ADDRESS,
    abi: PIXEL_CANVAS_ABI,
    functionName: "CANVAS_SIZE",
  });

  const { data: pixelPrice } = useReadContract({
    address: PIXEL_CANVAS_ADDRESS,
    abi: PIXEL_CANVAS_ABI,
    functionName: "PIXEL_PRICE",
  });

  const { data: totalPixelsSold } = useReadContract({
    address: PIXEL_CANVAS_ADDRESS,
    abi: PIXEL_CANVAS_ABI,
    functionName: "totalPixelsSold",
  });

  return {
    canvasSize: canvasSize ? Number(canvasSize) : 5,
    pixelPrice: pixelPrice ? Number(pixelPrice) / 1e18 : 0.00000001, // Wei to ETH
    totalPixelsSold: totalPixelsSold ? Number(totalPixelsSold) : 0,
  };
}
