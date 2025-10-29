import { useEffect } from "react";

import { useForm } from "react-hook-form";

import { Button } from "@/shared/components/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/Dialog";
import { Input } from "@/shared/components/Input";
import { weiToEther } from "@/shared/utils/weiToEther";

import { ImagePreview } from "./ImagePreview";
import { useImagePreview } from "../hooks/useImagePreview";
import { useGetPixelPrice, usePurchasePixel } from "../hooks/usePixelContract";

interface PixelPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  pixelIndex: number;
  onSuccess?: () => void;
}

export type PixelForm = {
  title: string;
  link: string;
  imageFile: FileList | null;
};

function PixelPurchaseModal({
  isOpen,
  onClose,
  pixelIndex,
  onSuccess,
}: PixelPurchaseModalProps) {
  const pixelPrice = useGetPixelPrice(pixelIndex);
  const { purchasePixel, isPending } = usePurchasePixel();

  const { register, handleSubmit, watch, reset } = useForm<PixelForm>({
    defaultValues: {
      title: "",
      link: "",
      imageFile: null,
    },
  });

  const { previewImage, handleRemoveImage } = useImagePreview({
    imageFile: watch("imageFile"),
    reset,
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen]);

  const uploadImage = async (file: File): Promise<string> => {
    console.log("Image upload not implemented yet:", file.name);
    return "";
  };

  const onSubmit = async (form: PixelForm) => {
    const { title, link, imageFile } = form;

    let imageUrl = "";

    // 이미지 파일이 있으면 업로드
    if (imageFile && imageFile.length > 0) {
      imageUrl = await uploadImage(imageFile[0]);
    }

    try {
      await purchasePixel(pixelIndex, title.trim(), imageUrl, link.trim());
      if (onSuccess) onSuccess();
      reset();
    } catch (err) {
      console.error("Purchase failed:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Pixel Purchase</DialogTitle>
              <DialogDescription>
                Claim your pixel for <strong>{weiToEther(pixelPrice)}</strong>{" "}
                Ethereum
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <label htmlFor="imageFile">* Image</label>
                {previewImage ? (
                  <ImagePreview
                    previewImage={previewImage}
                    handleRemoveImage={handleRemoveImage}
                  />
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                    <Input
                      id="imageFile"
                      type="file"
                      accept="image/png, image/jpeg"
                      className="hidden"
                      {...register("imageFile")}
                    />
                    <label
                      htmlFor="imageFile"
                      className="cursor-pointer flex flex-col items-center gap-2"
                      onClick={(e) => {
                        e.preventDefault();
                        const input = document.getElementById(
                          "imageFile"
                        ) as HTMLInputElement;
                        input?.click();
                      }}
                    >
                      <span className="text-sm text-gray-600">
                        Click to upload image
                      </span>
                      <span className="text-xs text-gray-400">
                        PNG, JPG up to 5MB
                      </span>
                    </label>
                  </div>
                )}
              </div>
              <div className="grid gap-3">
                <label htmlFor="title">* Title</label>
                <Input
                  type="text"
                  placeholder="Hello, World"
                  {...register("title")}
                />
              </div>
              <div className="grid gap-3">
                <label htmlFor="link">* Pixel Link</label>
                <Input
                  type="url"
                  placeholder="https://example.com"
                  {...register("link")}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={
                  isPending ||
                  !watch("imageFile") ||
                  !watch("title") ||
                  !watch("link")
                }
              >
                {isPending ? "Processing..." : "Save changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
      {/* <div
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-lg max-w-md w-full mx-4 p-6"
          onClick={handleModalContentClick}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">픽셀 구매</h2>
            <button
              onClick={onClose}
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
              <Button onClick={() => window.location.reload()}>
                지갑 연결
              </Button>
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
                <div className="text-red-600 text-sm">
                  오류: {error.message}
                </div>
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
                  onClick={onClose}
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
      </div> */}
    </>
  );
}

export { PixelPurchaseModal };
