import { useState, useCallback } from "react";

type UploadedImage = { file: File; url: string };
type Layout1Image = UploadedImage | null;

type UseImageUploadReturn = {
  uploadedImages: UploadedImage[];
  setUploadedImages: React.Dispatch<React.SetStateAction<UploadedImage[]>>;
  layout1Images: Layout1Image[];
  setLayout1Images: React.Dispatch<React.SetStateAction<Layout1Image[]>>;
  oversizedError: string | null;
  setOversizedError: React.Dispatch<React.SetStateAction<string | null>>;
  getRecommendedSize: (layout: string) => {
    width: number;
    height: number;
    text: string;
  };
  validateImageSize: (file: File, layout: string) => Promise<boolean>;
  handleRemoveImage: (index: number) => void;
  handleRemoveLayout1Image: (index: number) => void;
  handleAddMoreDropZone: () => void;
};

export function useImageUpload(): UseImageUploadReturn {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [layout1Images, setLayout1Images] = useState<Layout1Image[]>([null]);
  const [oversizedError, setOversizedError] = useState<string | null>(null);

  const getRecommendedSize = useCallback((currentLayout: string) => {
    switch (currentLayout) {
      case "layout-1":
        return { width: 50, height: 50, text: "50x50 pixels" };
      case "layout-2":
      case "layout-3":
        return { width: 160, height: 55, text: "160x55 pixels" };
      case "layout-4":
        return { width: 100, height: 25, text: "100x25 pixels" };
      default:
        return { width: 50, height: 50, text: "50x50 pixels" };
    }
  }, []);

  const validateImageSize = useCallback(
    (file: File, currentLayout: string): Promise<boolean> => {
      const recommendedSize = getRecommendedSize(currentLayout);

      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const isValid =
            img.width <= recommendedSize.width &&
            img.height <= recommendedSize.height;
          resolve(isValid);
        };
        img.onerror = () => resolve(false);
        img.src = URL.createObjectURL(file);
      });
    },
    [getRecommendedSize]
  );

  const handleRemoveImage = useCallback(
    (indexToRemove: number) => {
      URL.revokeObjectURL(uploadedImages[indexToRemove].url);
      setUploadedImages((prev) =>
        prev.filter((_, index) => index !== indexToRemove)
      );
      setOversizedError(null);
    },
    [uploadedImages]
  );

  const handleRemoveLayout1Image = useCallback(
    (indexToRemove: number) => {
      const image = layout1Images[indexToRemove];
      if (image?.url) {
        URL.revokeObjectURL(image.url);
      }

      setLayout1Images((prev) => {
        const newImages = [...prev];
        newImages[indexToRemove] = null;
        return newImages;
      });

      setOversizedError(null);
    },
    [layout1Images]
  );

  const handleAddMoreDropZone = useCallback(() => {
    if (layout1Images.length < 5) {
      setLayout1Images((prev) => [...prev, null]);
    }
  }, [layout1Images.length]);

  return {
    uploadedImages,
    setUploadedImages,
    layout1Images,
    setLayout1Images,
    oversizedError,
    setOversizedError,
    getRecommendedSize,
    validateImageSize,
    handleRemoveImage,
    handleRemoveLayout1Image,
    handleAddMoreDropZone,
  };
}
