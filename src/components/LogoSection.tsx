import {
  Box,
  Text,
  ChoiceList,
  DropZone,
  Banner,
  Button,
  InlineStack,
  type IconSource,
} from "@shopify/polaris";
import { useCallback, useEffect } from "react";
import { DeleteIcon } from "@shopify/polaris-icons";
import type { BadgeData } from "../types/badge.type";
import { useImageUpload } from "../hooks/useImageUpload";

type LogoSectionProps = {
  badgeData: BadgeData;
  setBadgeData: React.Dispatch<React.SetStateAction<BadgeData>>;
  layout: string;
};

function LogoSection({ badgeData, setBadgeData, layout }: LogoSectionProps) {
  const {
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
  } = useImageUpload();

  // Update badge data when layout1Images change
  useEffect(() => {
    if (layout === "layout-1") {
      const logoUrls = layout1Images
        .filter((image): image is { file: File; url: string } => image !== null)
        .map((image) => image.url);

      setBadgeData((prev) => ({
        ...prev,
        logos: logoUrls,
      }));
    } else {
      // Clear logos array when switching away from layout-1
      setBadgeData((prev) => ({
        ...prev,
        logos: undefined,
      }));
    }
  }, [layout1Images, layout, setBadgeData]);

  // Set default logos for non-layout-1 layouts
  useEffect(() => {
    if (layout !== "layout-1" && !badgeData.logoUrl) {
      const defaultLogo = badgeData.logo || "google";
      let logoUrl = "";

      if (layout === "layout-4") {
        switch (defaultLogo) {
          case "google":
            logoUrl = "/logos_google_small.svg";
            break;
          case "facebook":
            logoUrl = "/facebook_white.png";
            break;
          case "other":
            logoUrl = "";
            break;
          default:
            logoUrl = "/logos_google_small.svg";
        }
      } else {
        switch (defaultLogo) {
          case "google":
            logoUrl = "/logos_google.svg";
            break;
          case "facebook":
            logoUrl = "/facebook_blue.png";
            break;
          case "other":
            logoUrl = "";
            break;
          default:
            logoUrl = "/logos_google.svg";
        }
      }

      setBadgeData((prev) => ({
        ...prev,
        logo: defaultLogo,
        logoUrl: logoUrl,
      }));
    }
  }, [layout, badgeData.logo, badgeData.logoUrl, setBadgeData]);

  const handleDropZoneDrop = useCallback(
    async (_dropFiles: File[], acceptedFiles: File[]) => {
      const newImages: { file: File; url: string }[] = [];
      const recommendedSize = getRecommendedSize(layout);

      setOversizedError(null);

      for (const file of acceptedFiles) {
        const isValidSize = await validateImageSize(file, layout);
        newImages.push({
          file,
          url: URL.createObjectURL(file),
        });

        if (!isValidSize) {
          setOversizedError(
            `Warning: Image "${file.name}" exceeds recommended size of ${recommendedSize.text}.`
          );
        }
      }

      if (newImages.length > 0) {
        setUploadedImages((prev) => [...prev, ...newImages]);

        if (badgeData.logo === "other" && newImages.length > 0) {
          setBadgeData((prev) => ({
            ...prev,
            logoUrl: newImages[0].url,
          }));
        }
      }
    },
    [
      layout,
      validateImageSize,
      getRecommendedSize,
      badgeData.logo,
      setBadgeData,
      setUploadedImages,
      setOversizedError,
    ]
  );

  const handleLayout1DropZoneDrop = useCallback(
    (dropZoneIndex: number) =>
      async (_dropFiles: File[], acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
          const file = acceptedFiles[0];
          const isValidSize = await validateImageSize(file, "layout-1");
          const recommendedSize = getRecommendedSize("layout-1");

          setOversizedError(null);

          const url = URL.createObjectURL(file);

          setLayout1Images((prev) => {
            const newImages = [...prev];
            if (newImages[dropZoneIndex]?.url) {
              URL.revokeObjectURL(newImages[dropZoneIndex]!.url);
            }
            newImages[dropZoneIndex] = { file, url };
            return newImages;
          });

          if (!isValidSize) {
            setOversizedError(
              `Warning: Image "${file.name}" exceeds recommended size of ${recommendedSize.text}.`
            );
          }
        }
      },
    [validateImageSize, getRecommendedSize, setLayout1Images, setOversizedError]
  );

  const handleRemoveImageWithLogo = useCallback(
    (indexToRemove: number) => {
      handleRemoveImage(indexToRemove);

      if (badgeData.logo === "other") {
        const remainingImages = uploadedImages.filter(
          (_, index) => index !== indexToRemove
        );
        setBadgeData((prev) => ({
          ...prev,
          logoUrl: remainingImages.length > 0 ? remainingImages[0].url : "",
        }));
      }
    },
    [handleRemoveImage, badgeData.logo, uploadedImages, setBadgeData]
  );

  const renderUploadedImages = () => {
    if (uploadedImages.length === 0) return null;

    return (
      <Box paddingBlockStart="300">
        <Text variant="bodyMd" as="p" fontWeight="medium">
          Uploaded Images:
        </Text>
        <Box paddingBlockStart="200">
          <InlineStack gap="200">
            {uploadedImages.map((image, index) => (
              <div
                key={index}
                style={{ position: "relative", display: "inline-block" }}
              >
                <div style={{ width: 60, height: 60 }}>
                  <img
                    src={image.url}
                    alt={`Logo ${index + 1}`}
                    style={{ width: 40, height: 40 }}
                  />
                </div>

                <div
                  style={{
                    position: "absolute",
                    top: "0px",
                    right: "4px",
                    zIndex: 1,
                  }}
                >
                  <Button
                    variant="plain"
                    tone="critical"
                    size="micro"
                    icon={DeleteIcon as IconSource}
                    onClick={() => handleRemoveImageWithLogo(index)}
                  />
                </div>
              </div>
            ))}
          </InlineStack>
        </Box>
      </Box>
    );
  };

  const renderLayout1LogoSection = () => {
    const recommendedSize = getRecommendedSize("layout-1");

    return (
      <Box>
        <Text variant="bodyLg" as="p" fontWeight="medium">
          Logo
        </Text>

        <Box paddingBlockStart="300">
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {layout1Images.map((image, index) => (
              <Box key={index}>
                {image ? (
                  <div style={{ position: "relative", display: "flex" }}>
                    <div style={{ width: 60, height: 60, marginTop: 10 }}>
                      <img
                        src={image.url}
                        alt={`Logo ${index + 1}`}
                        style={{ width: 40, height: 40 }}
                      />
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        top: "0px",
                        right: "0px",
                        zIndex: 1,
                      }}
                    >
                      <Button
                        variant="plain"
                        tone="critical"
                        size="micro"
                        icon={DeleteIcon as IconSource}
                        onClick={() => handleRemoveLayout1Image(index)}
                      />
                    </div>
                  </div>
                ) : (
                  <div style={{ width: 40, height: 40 }}>
                    <DropZone
                      onDrop={handleLayout1DropZoneDrop(index)}
                      accept="image/*"
                    >
                      <DropZone.FileUpload />
                    </DropZone>
                  </div>
                )}
              </Box>
            ))}
            {layout1Images.length < 5 && (
              <Button variant="secondary" onClick={handleAddMoreDropZone}>
                + add more
              </Button>
            )}
          </div>
        </Box>
        {oversizedError && (
          <Banner
            tone="warning"
            title="Warning"
            onDismiss={() => setOversizedError(null)}
          >
            {oversizedError}
          </Banner>
        )}
        <Box paddingBlockStart="200">
          <Text variant="bodyMd" as="p" tone="subdued">
            **You can add maximum 5 logos
          </Text>
        </Box>
        <Box paddingBlockStart="200">
          <Text variant="bodyMd" as="p" tone="subdued">
            Recommended size: {recommendedSize.text}
          </Text>
        </Box>
      </Box>
    );
  };

  const renderOtherLayoutsLogoSection = () => {
    const recommendedSize = getRecommendedSize(layout);

    const handleLogoChoice = (value: string[]) => {
      const selectedLogo = value[0];

      let logoUrl = "";
      if (layout === "layout-4") {
        switch (selectedLogo) {
          case "google":
            logoUrl = "/logos_google_small.svg";
            break;
          case "facebook":
            logoUrl = "/facebook_white.png";
            break;
          case "other":
            logoUrl = uploadedImages.length > 0 ? uploadedImages[0].url : "";
            break;
          default:
            logoUrl = "/logos_google_small.svg";
        }
      } else {
        switch (selectedLogo) {
          case "google":
            logoUrl = "/logos_google.svg";
            break;
          case "facebook":
            logoUrl = "/facebook_blue.png";
            break;
          case "other":
            logoUrl = uploadedImages.length > 0 ? uploadedImages[0].url : "";
            break;
          default:
            logoUrl = "/logos_google.svg";
        }
      }

      setBadgeData((prev) => ({
        ...prev,
        logo: selectedLogo,
        logoUrl: logoUrl,
      }));
    };

    return (
      <>
        <ChoiceList
          title="Logo"
          choices={[
            { label: "Google", value: "google" },
            { label: "Facebook", value: "facebook" },
            { label: "Other", value: "other" },
          ]}
          selected={badgeData.logo ? [badgeData.logo] : ["google"]}
          onChange={handleLogoChoice}
        />
        {badgeData.logo === "other" && (
          <Box>
            <Box paddingBlockStart="200">
              <Text variant="bodyMd" as="p" tone="subdued">
                Recommended size: {recommendedSize.text}
              </Text>
            </Box>

            <Box paddingBlockStart="300">
              {uploadedImages.length === 0 ? (
                <div style={{ width: 40, height: 40 }}>
                  <DropZone onDrop={handleDropZoneDrop} accept="image/*">
                    <DropZone.FileUpload />
                  </DropZone>
                </div>
              ) : (
                renderUploadedImages()
              )}
              {oversizedError && (
                <Banner
                  tone="warning"
                  title="Warning"
                  onDismiss={() => setOversizedError(null)}
                >
                  {oversizedError}
                </Banner>
              )}
            </Box>
          </Box>
        )}
      </>
    );
  };

  return layout === "layout-1"
    ? renderLayout1LogoSection()
    : renderOtherLayoutsLogoSection();
}

export default LogoSection;
