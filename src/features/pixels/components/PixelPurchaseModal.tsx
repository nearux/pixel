import { useState } from "react";

import { useAccount } from "wagmi";

import { Button } from "@/shared/components/Button";

import { usePurchasePixel } from "../hooks/usePixelContract";

interface PixelPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  pixelIndex: number;
  onSuccess?: () => void;
}

function PixelPurchaseModal({
  isOpen,
  onClose,
  pixelIndex,
  onSuccess,
}: PixelPurchaseModalProps) {
  const { isConnected } = useAccount();
  const { purchasePixel, isPending, isSuccess, error } = usePurchasePixel();
  const [text, setText] = useState("");
  const [link, setLink] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      alert("텍스트를 입력해주세요.");
      return;
    }

    try {
      await purchasePixel(
        pixelIndex,
        text.trim(),
        imageUrl.trim(),
        link.trim()
      );
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Purchase failed:", err);
    }
  };

  const handleClose = () => {
    setText("");
    setLink("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">픽셀 구매</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600">위치: ({pixelIndex})</p>
          <p className="text-sm text-gray-600">가격: 0.00000001 ETH</p>
        </div>

        {!isConnected ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">지갑을 연결해주세요</p>
            <Button onClick={() => window.location.reload()}>지갑 연결</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                표시할 텍스트 *
              </label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="예: Hello World"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                링크 URL
              </label>
              <input
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm">오류: {error.message}</div>
            )}

            {isSuccess && (
              <div className="text-green-600 text-sm">
                픽셀 구매가 완료되었습니다!
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
                disabled={isPending}
                className="flex-1"
              >
                취소
              </Button>
              <Button
                type="submit"
                disabled={isPending || !text.trim()}
                className="flex-1"
              >
                {isPending ? "처리 중..." : "구매하기"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export { PixelPurchaseModal };
