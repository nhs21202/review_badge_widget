import "./App.css";
import {
  Box,
  BlockStack,
  Card,
  Grid,
  InlineGrid,
  Text,
  Divider,
} from "@shopify/polaris";
import HeroBanner from "./components/HeroBanner";
import BadgeConfigForm from "./components/BadgeConfigForm";
import { useState, useCallback, useMemo } from "react";
import BadgePreview from "./components/BadgePreview";
import type { BadgeData } from "./types/badge.type";

function App() {
  const [isValidRating, setIsValidRating] = useState(true);
  const [layout, setLayout] = useState("layout-1");

  const initialBadgeData: BadgeData = useMemo(
    () => ({
      logo: "google",
      logos: [],
      otherLogo: "",
      firstSelect: "5",
      secondSelect: ".0",
      averageRating: "5.0",
      text: "From 100 verified reviews",
      openLink: "",
      storeName: "Demo store",
      reviewText: "100 reviews",
      verifiedText: layout === "layout-3" ? "Verified by" : "Powered by",
      colorConfig: {
        stars: "#FFC700",
        ratingNumber: "#000000",
        text: "#686868",
        background: "#FFFFFF",
        stroke: "#AAAAAA",
        storeName: "#000000",
        footerBackground: "#000000",
      },
    }),
    [layout]
  );

  const [badgeData, setBadgeData] = useState<BadgeData>(initialBadgeData);

  const handleLayoutChange = useCallback(
    (newLayout: string) => {
      setLayout(newLayout);
      const updatedBadgeData = {
        ...initialBadgeData,
        verifiedText: newLayout === "layout-3" ? "Verified by" : "Powered by",
        colorConfig: {
          ...initialBadgeData.colorConfig,
          text:
            newLayout === "layout-1" || newLayout === "layout-2"
              ? "#686868"
              : "#000000",
        },
      };
      setBadgeData(updatedBadgeData);
    },
    [initialBadgeData]
  );

  return (
    <div className="app">
      <div className="gradient-top"></div>
      <div className="gradient-bottom"></div>
      <HeroBanner />
      <div className="features-section">
        <InlineGrid
          columns={{ xs: 1, sm: 1, md: 12, lg: 12, xl: 12 }}
          gap="600"
        >
          <Grid.Cell columnSpan={{ xs: 1, sm: 1, md: 6, lg: 5, xl: 5 }}>
            <BadgeConfigForm
              badgeData={badgeData}
              setBadgeData={setBadgeData}
              isValidRating={isValidRating}
              setIsValidRating={setIsValidRating}
              layout={layout}
            />
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 1, sm: 1, md: 6, lg: 7, xl: 7 }}>
            <Box>
              <Card padding="0">
                <Box background="bg-fill-secondary">
                  <Box paddingBlock="400" paddingInline="500">
                    <BlockStack gap="200">
                      <Text variant="headingMd" as="h2">
                        Preview
                      </Text>
                    </BlockStack>
                  </Box>
                  <Divider />
                  <BadgePreview
                    layout={layout}
                    setLayout={handleLayoutChange}
                    badgeData={badgeData}
                  />
                </Box>
                <Divider />
              </Card>
            </Box>
          </Grid.Cell>
        </InlineGrid>
      </div>
    </div>
  );
}

export default App;
