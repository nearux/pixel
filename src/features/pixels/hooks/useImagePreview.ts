import { useEffect, useState } from "react";

import { UseFormReset } from "react-hook-form";

import { PixelForm } from "../components/PixelPurchaseModal";

interface Props {
  imageFile: FileList | null;
  reset: UseFormReset<PixelForm>;
}

export function useImagePreview({ imageFile, reset }: Props) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleRemoveImage = () => {
    setPreviewImage(null);
    reset({ imageFile: null }, { keepValues: true });
  };

  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setPreviewImage(null);
    }
  }, [imageFile]);

  return {
    previewImage,
    handleRemoveImage,
  };
}
