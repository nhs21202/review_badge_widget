import { BlockStack, Box, Text } from "@shopify/polaris";
import type { BadgeData } from "../types/badge.type";
import ColorPickerCustom from "./ColorPickerCustom";

type ColorConfigSectionProps = {
  badgeData: BadgeData;
  setBadgeData: React.Dispatch<React.SetStateAction<BadgeData>>;
  layout: string;
};

function ColorConfigSection({
  badgeData,
  setBadgeData,
  layout,
}: ColorConfigSectionProps) {
  const handleColorChange = (value: string, id: string) => {
    setBadgeData((prev) => ({
      ...prev,
      colorConfig: { ...prev.colorConfig, [id]: value },
    }));
  };

  return (
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
          onChange={handleColorChange}
          autoComplete="off"
          disabled={false}
        />
        <ColorPickerCustom
          label="Text"
          value={badgeData.colorConfig?.text}
          id="text"
          onChange={handleColorChange}
          autoComplete="off"
          disabled={false}
        />
        <ColorPickerCustom
          label="Background"
          value={badgeData.colorConfig?.background}
          id="background"
          onChange={handleColorChange}
          autoComplete="off"
          disabled={false}
        />
        <ColorPickerCustom
          label="Stroke"
          value={badgeData.colorConfig?.stroke}
          id="stroke"
          onChange={handleColorChange}
          autoComplete="off"
          disabled={false}
        />
        {layout === "layout-1" && (
          <ColorPickerCustom
            label="Rating number"
            value={badgeData.colorConfig?.ratingNumber}
            id="ratingNumber"
            onChange={handleColorChange}
            autoComplete="off"
            disabled={false}
          />
        )}
        {layout === "layout-2" && (
          <ColorPickerCustom
            label="Store name"
            value={badgeData.colorConfig?.storeName}
            id="storeName"
            onChange={handleColorChange}
            autoComplete="off"
            disabled={false}
          />
        )}
        {layout === "layout-4" && (
          <ColorPickerCustom
            label="Footer background"
            value={badgeData.colorConfig?.footerBackground}
            id="footerBackground"
            onChange={handleColorChange}
            autoComplete="off"
            disabled={false}
          />
        )}
      </div>
    </BlockStack>
  );
}

export default ColorConfigSection;
