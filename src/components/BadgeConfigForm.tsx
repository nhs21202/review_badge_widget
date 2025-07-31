import {
  Box,
  BlockStack,
  Card,
  Text,
  Divider,
  FormLayout,
} from "@shopify/polaris";
import type { BadgeData } from "../types/badge.type";
import RatingSelector from "./RatingSelector";
import LogoSection from "./LogoSection";
import TextFieldsSection from "./TextFieldsSection";
import ColorConfigSection from "./ColorConfigSection";
import HTMLCodeSection from "./HTMLCodeSection";

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
            <LogoSection
              badgeData={badgeData}
              setBadgeData={setBadgeData}
              layout={layout}
            />
            <RatingSelector
              badgeData={badgeData}
              setBadgeData={setBadgeData}
              isValidRating={isValidRating}
              setIsValidRating={setIsValidRating}
            />
            <TextFieldsSection
              badgeData={badgeData}
              setBadgeData={setBadgeData}
              layout={layout}
            />
          </FormLayout>
        </Box>
        <Divider borderWidth="050" borderColor="border-brand" />
        <ColorConfigSection
          badgeData={badgeData}
          setBadgeData={setBadgeData}
          layout={layout}
        />
        <Divider borderWidth="050" borderColor="border-brand" />
        <HTMLCodeSection
          badgeData={badgeData}
          setBadgeData={setBadgeData}
          layout={layout}
        />
      </Card>
    </Box>
  );
}

export default BadgeConfigForm;
