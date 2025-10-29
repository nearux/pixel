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
  const { purchasePixel, isPending, isSuccess } = usePurchasePixel();

  const pixelPriceInEther = weiToEther(pixelPrice);

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

  useEffect(() => {
    if (isSuccess) {
      onSuccess?.();
      reset();
      onClose();
    }
  }, [isSuccess]);

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to upload image");
    }

    const data = await response.json();
    return data.imageUrl;
  };

  const onSubmit = async (form: PixelForm) => {
    const { title, link, imageFile } = form;

    let imageUrl = "";

    if (imageFile) {
      imageUrl = await uploadImage(imageFile[0]);
    }

    try {
      await purchasePixel({
        price: pixelPriceInEther,
        pixelIndex,
        text: title.trim(),
        imageUrl: imageUrl.trim(),
        link: link.trim(),
      });

      onSuccess?.();
    } catch (err) {
      console.error("Purchase failed:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <DialogHeader>
              <DialogTitle>Pixel Purchase</DialogTitle>
              <DialogDescription>
                Claim your pixel for <strong>{pixelPriceInEther}</strong>{" "}
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
                {isPending ? "Processing..." : "Purchase"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export { PixelPurchaseModal };
