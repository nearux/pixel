import React from "react";

interface Props {
  previewImage: string;
  handleRemoveImage: () => void;
}

export const ImagePreview = ({ previewImage, handleRemoveImage }: Props) => {
  return (
    <div className="relative flex justify-center w-full">
      <img
        src={previewImage}
        alt="Preview"
        className="w-50 h-50 object-cover rounded-md border"
      />
      <button
        type="button"
        onClick={handleRemoveImage}
        className="absolute top-0 right-0 bg-zinc-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-zinc-600"
      >
        ×
      </button>
    </div>
  );
};
