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
import { toast } from "@/shared/components/Toast/toastManager";
import { weiToEther } from "@/shared/utils/weiToEther";

import { ImagePreview } from "./ImagePreview";
import {
  useGetPixelPrice,
  usePurchasePixel,
  useImagePreview,
  useTransactionNotify,
} from "../hooks";

interface PixelPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  pixelId: bigint;
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
  pixelId,
  onSuccess,
}: PixelPurchaseModalProps) {
  const pixelPrice = useGetPixelPrice(pixelId);
  const { purchasePixel, isPending, isSuccess, error } = usePurchasePixel();
  const { isProcessingPurchase, notifyMessage, setNotifyType } =
    useTransactionNotify({
      isPending,
      error,
    });

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
    if (isSuccess) {
      toast.success("Pixel purchased successfully");

      reset();
      onClose();
      setNotifyType(null);

      onSuccess?.();
    }
  }, [isSuccess]);

  const onSubmit = async (form: PixelForm) => {
    const { title, link, imageFile } = form;

    const formData = new FormData();

    formData.append("title", title);
    formData.append("link", link);
    formData.append("pixelId", pixelId.toString());
    formData.append("image", imageFile![0]);

    setNotifyType("uploading");

    const { metadataCid, imageId, metadataId } = await fetch("/api/files", {
      method: "POST",
      body: formData,
    }).then((res) => res.json());

    try {
      await purchasePixel({
        price: pixelPriceInEther,
        pixelId: pixelId,
        metadataCid,
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      toast.error("Pixel purchase failed");

      await fetch("/api/files", {
        method: "DELETE",
        body: JSON.stringify({ ids: [metadataId, imageId] }),
      });

      toast.success("Delete upload files!");

      setNotifyType(null);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={() => {
          if (!isProcessingPurchase) {
            reset();
            onClose();
          }
        }}
      >
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
                  disabled={isProcessingPurchase}
                  {...register("title")}
                />
              </div>
              <div className="grid gap-3">
                <label htmlFor="link">* Pixel Link</label>
                <Input
                  type="url"
                  placeholder="https://example.com"
                  disabled={isProcessingPurchase}
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
                  isProcessingPurchase ||
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
      {notifyMessage && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 flex items-center justify-center z-100">
          <div className="text-white text-2xl font-bold">{notifyMessage}</div>
        </div>
      )}
    </>
  );
}

export { PixelPurchaseModal };
