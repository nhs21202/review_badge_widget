import {
  Box,
  BlockStack,
  Card,
  Text,
  Divider,
  FormLayout,
  ChoiceList,
  TextField,
  Select,
  Button,
  DropZone,
  InlineStack,
  type IconSource,
  Banner,
} from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";
import { DeleteIcon } from "@shopify/polaris-icons";
import type { BadgeData } from "../types/badge.type";
import { useForm, Controller } from "react-hook-form";
import { URL_REGEX } from "../constant/regex";
import ColorPickerCustom from "./ColorPickerCustom";
import { generateBadgeHTML } from "../utils/htmlGenerator";
import HTMLDisplay from "./HTMLDisplay";
import { BRANDING_STATEMENT } from "../constant/branding";

type BadgeConfigFormProps = {
  badgeData: BadgeData;
  setBadgeData: React.Dispatch<React.SetStateAction<BadgeData>>;
  isValidRating: boolean;
  setIsValidRating: React.Dispatch<React.SetStateAction<boolean>>;
  layout: string;
};

function BadgeConfigForm({
  badgeData,
  setBadgeData,
  isValidRating,
  setIsValidRating,
  layout,
}: BadgeConfigFormProps) {
  const [uploadedImages, setUploadedImages] = useState<
    { file: File; url: string }[]
  >([]);
  const [layout1Images, setLayout1Images] = useState<
    ({ file: File; url: string } | null)[]
  >([null]);
  const [oversizedError, setOversizedError] = useState<string | null>(null);
  const [generatedHTML, setGeneratedHTML] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isHTMLDisplayOpen, setIsHTMLDisplayOpen] = useState(false);

  const {
    control,
    formState: { errors },
    watch,
  } = useForm<{ openLink: string }>({
    mode: "onChange",

    defaultValues: {
      openLink: badgeData.openLink || "",
    },
  });

  const openLinkValue = watch("openLink");

  useEffect(() => {
    setBadgeData((prev) => ({
      ...prev,
      openLink: openLinkValue,
    }));
  }, [openLinkValue, setBadgeData]);

  // Close HTML display when layout changes
  useEffect(() => {
    setIsHTMLDisplayOpen(false);
  }, [layout]);

  const validateUrl = (value: string) => {
    if (!value) return true;

    try {
      new URL(value);
      return true;
    } catch {
      if (value.match(URL_REGEX) || value.startsWith("/")) {
        return true;
      }
      return "Please enter a valid URL (e.g., https://example.com)";
    }
  };

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

  useEffect(() => {
    if (layout !== "layout-1" && !badgeData.logoUrl) {
      const defaultLogo = badgeData.logo || "google";
      let logoUrl = "";

      switch (defaultLogo) {
        case "google":
          logoUrl = "/logos_google.svg";
          break;
        case "facebook":
          logoUrl = "/facebook_blue.svg";
          break;
        case "other":
          logoUrl = "";
          break;
        default:
          logoUrl = "/logos_google.svg";
      }

      setBadgeData((prev) => ({
        ...prev,
        logo: defaultLogo,
        logoUrl: logoUrl,
      }));
    }
    if (layout === "layout-4" && !badgeData.logoUrl) {
      const defaultLogo = badgeData.logo || "google";
      let logoUrl = "";

      switch (defaultLogo) {
        case "google":
          logoUrl = "/logos_google_small.svg";
          break;
        case "facebook":
          logoUrl = "/facebook_white.svg";
          break;
        case "other":
          logoUrl = "";
          break;
        default:
          logoUrl = "/logos_google_small.svg";
      }

      setBadgeData((prev) => ({
        ...prev,
        logo: defaultLogo,
        logoUrl: logoUrl,
      }));
    }
  }, [layout, badgeData.logo, badgeData.logoUrl, setBadgeData]);

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

  const handleFirstSelectChange = (value: string) => {
    const newRating = parseFloat(value + badgeData.secondSelect);
    if (newRating <= 5.0) {
      setBadgeData((prev) => ({
        ...prev,
        firstSelect: value,
        averageRating: newRating.toFixed(1).toString(),
      }));
      setIsValidRating(true);
    } else {
      if (value === "5") {
        setBadgeData((prev) => ({
          ...prev,
          firstSelect: value,
          secondSelect: ".0",
          averageRating: "5.0",
        }));
        setIsValidRating(true);
      }
    }
  };

  const handleSecondSelectChange = (value: string) => {
    const newRating = parseFloat(badgeData.firstSelect + value);
    if (newRating <= 5.0) {
      setBadgeData((prev) => ({
        ...prev,
        secondSelect: value,
        averageRating: newRating.toFixed(1).toString(),
      }));
      setIsValidRating(true);
    } else {
      setIsValidRating(false);
    }
  };

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
    ]
  );

  const handleRemoveImage = useCallback(
    (indexToRemove: number) => {
      URL.revokeObjectURL(uploadedImages[indexToRemove].url);
      setUploadedImages((prev) =>
        prev.filter((_, index) => index !== indexToRemove)
      );
      setOversizedError(null);

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
    [uploadedImages, badgeData.logo, setBadgeData]
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
    [validateImageSize, getRecommendedSize]
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
                    onClick={() => handleRemoveImage(index)}
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
            logoUrl = "/facebook_white.svg";
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
            logoUrl = "/facebook_blue.svg";
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

  const handleGenerateCode = async () => {
    try {
      const htmlCode = await generateBadgeHTML(badgeData, layout);
      setGeneratedHTML(htmlCode);
      setIsHTMLDisplayOpen(true);

      setBadgeData((prev) => ({
        ...prev,
        htmlCode: htmlCode,
      }));
    } catch (error) {
      console.error("Error generating HTML:", error);
    }
  };

  const copyToClipboard = async () => {
    try {
      const HTMLWithBranding = BRANDING_STATEMENT + "\n" + generatedHTML;
      await navigator.clipboard.writeText(HTMLWithBranding);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
    } catch (err) {
      console.log(`Failed to copy: ${err}`);
    }
  };

  return (
    <Box>
      <Card padding="0">
        <BlockStack gap="200">
          <Box paddingBlock="400" paddingInline="500">
            <Text variant="headingMd" as="h2">
              Elements
            </Text>
          </Box>
        </BlockStack>
        <Box paddingBlockEnd="400" paddingInline="500">
          <FormLayout>
            {layout === "layout-1"
              ? renderLayout1LogoSection()
              : renderOtherLayoutsLogoSection()}
            {layout === "layout-2" && (
              <TextField
                autoComplete="off"
                label="Store name"
                value={badgeData.storeName}
                onChange={(value) =>
                  setBadgeData((prev) => ({ ...prev, storeName: value }))
                }
              />
            )}

            <div style={{ maxWidth: "300px" }}>
              <FormLayout.Group condensed title="Average rating">
                <Select
                  label=""
                  options={["1", "2", "3", "4", "5"]}
                  value={badgeData.firstSelect}
                  onChange={(value) => handleFirstSelectChange(value)}
                />
                <Select
                  label=""
                  options={[
                    ".0",
                    ".1",
                    ".2",
                    ".3",
                    ".4",
                    ".5",
                    ".6",
                    ".7",
                    ".8",
                    ".9",
                  ]}
                  value={badgeData.secondSelect}
                  error={!isValidRating}
                  onChange={(value) => handleSecondSelectChange(value)}
                />
              </FormLayout.Group>
            </div>
            {!isValidRating && (
              <Text variant="bodyMd" as="p" tone="critical">
                Rating must be less than or equal to 5.0.
              </Text>
            )}
            {(layout === "layout-1" || layout === "layout-2") && (
              <TextField
                autoComplete="off"
                label="Text"
                value={badgeData.text}
                onChange={(value) =>
                  setBadgeData((prev) => ({ ...prev, text: value }))
                }
              />
            )}

            {(layout === "layout-3" || layout === "layout-4") && (
              <div>
                <TextField
                  autoComplete="off"
                  label="Review text"
                  value={badgeData.reviewText}
                  onChange={(value) =>
                    setBadgeData((prev) => ({ ...prev, reviewText: value }))
                  }
                />
                <TextField
                  autoComplete="off"
                  label="Verified text"
                  value={badgeData.verifiedText}
                  onChange={(value) =>
                    setBadgeData((prev) => ({ ...prev, verifiedText: value }))
                  }
                />
              </div>
            )}

            <Controller
              name="openLink"
              control={control}
              rules={{
                validate: validateUrl,
              }}
              render={({ field }) => (
                <TextField
                  autoComplete="off"
                  label="Open link when click on the badge"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.openLink?.message}
                  placeholder="https://example.com"
                />
              )}
            />
          </FormLayout>
        </Box>
        <Divider borderWidth="050" borderColor="border-brand" />
        <BlockStack gap="200">
          <Box paddingBlockStart="400" paddingInline="500">
            <Text variant="headingMd" as="h2">
              Widget
            </Text>
          </Box>
          <div className="ot-color-widget-container">
            <ColorPickerCustom
              label="Stars"
              value={badgeData.colorConfig?.stars}
              id="stars"
              onChange={(value, id) =>
                setBadgeData((prev) => ({
                  ...prev,
                  colorConfig: { ...prev.colorConfig, [id]: value },
                }))
              }
              autoComplete="off"
              disabled={false}
            />
            <ColorPickerCustom
              label="Text"
              value={badgeData.colorConfig?.text}
              id="text"
              onChange={(value, id) =>
                setBadgeData((prev) => ({
                  ...prev,
                  colorConfig: { ...prev.colorConfig, [id]: value },
                }))
              }
              autoComplete="off"
              disabled={false}
            />
            <ColorPickerCustom
              label="Background"
              value={badgeData.colorConfig?.background}
              id="background"
              onChange={(value, id) =>
                setBadgeData((prev) => ({
                  ...prev,
                  colorConfig: { ...prev.colorConfig, [id]: value },
                }))
              }
              autoComplete="off"
              disabled={false}
            />
            <ColorPickerCustom
              label="Stroke"
              value={badgeData.colorConfig?.stroke}
              id="stroke"
              onChange={(value, id) =>
                setBadgeData((prev) => ({
                  ...prev,
                  colorConfig: { ...prev.colorConfig, [id]: value },
                }))
              }
              autoComplete="off"
              disabled={false}
            />
            {layout === "layout-1" && (
              <ColorPickerCustom
                label="Rating number"
                value={badgeData.colorConfig?.ratingNumber}
                id="ratingNumber"
                onChange={(value, id) =>
                  setBadgeData((prev) => ({
                    ...prev,
                    colorConfig: { ...prev.colorConfig, [id]: value },
                  }))
                }
                autoComplete="off"
                disabled={false}
              />
            )}

            {layout === "layout-2" && (
              <ColorPickerCustom
                label="Store name"
                value={badgeData.colorConfig?.storeName}
                id="storeName"
                onChange={(value, id) =>
                  setBadgeData((prev) => ({
                    ...prev,
                    colorConfig: { ...prev.colorConfig, [id]: value },
                  }))
                }
                autoComplete="off"
                disabled={false}
              />
            )}
            {layout === "layout-4" && (
              <ColorPickerCustom
                label="Footer background"
                value={badgeData.colorConfig?.footerBackground}
                id="footerBackground"
                onChange={(value, id) =>
                  setBadgeData((prev) => ({
                    ...prev,
                    colorConfig: { ...prev.colorConfig, [id]: value },
                  }))
                }
                autoComplete="off"
                disabled={false}
              />
            )}
          </div>
        </BlockStack>
        <Divider borderWidth="050" borderColor="border-brand" />
        <BlockStack gap="200">
          <Box paddingBlock="400" paddingInline="500">
            <Button variant="primary" size="large" onClick={handleGenerateCode}>
              Generate code
            </Button>
          </Box>
          {isHTMLDisplayOpen && (
            <HTMLDisplay
              HTMLCodeString={generatedHTML}
              isCopied={isCopied}
              handleCopy={copyToClipboard}
            />
          )}
        </BlockStack>
      </Card>
    </Box>
  );
}

export default BadgeConfigForm;
