import { Box, RadioButton } from "@shopify/polaris";
import React, { useCallback, useMemo } from "react";
import type { BadgeData } from "../types/badge.type";
import BadgeLayout1 from "./Badges/BadgeLayout1";
import BadgeLayout2 from "./Badges/BadgeLayout2";
import BadgeLayout3 from "./Badges/BadgeLayout3";
import BadgeLayout4 from "./Badges/BadgeLayout4";

const badgeLayoutOptions = [
  {
    image: <img src={"/badge_layout_1.png"} alt="badge-layout-1" />,
    value: "layout-1",
  },
  {
    image: <img src={"/badge_layout_2.png"} alt="badge-layout-2" />,
    value: "layout-2",
  },
  {
    image: <img src={"/badge_layout_3.png"} alt="badge-layout-3" />,
    value: "layout-3",
  },
  {
    image: <img src={"/badge_layout_4.png"} alt="badge-layout-4" />,
    value: "layout-4",
  },
];

type BadgePreviewProps = {
  layout: string;
  setLayout: (layout: string) => void;
  badgeData: BadgeData;
};

const BadgePreview = React.memo(
  ({ layout, setLayout, badgeData }: BadgePreviewProps) => {
    const renderBadge = useCallback(
      (currentLayout: string, currentBadgeData: BadgeData) => {
        switch (currentLayout) {
          case "layout-1":
            return <BadgeLayout1 badgeData={currentBadgeData} />;
          case "layout-2":
            return <BadgeLayout2 badgeData={currentBadgeData} />;
          case "layout-3":
            return <BadgeLayout3 badgeData={currentBadgeData} />;
          case "layout-4":
            return <BadgeLayout4 badgeData={currentBadgeData} />;
          default:
            return null;
        }
      },
      []
    );

    const handleLayoutClick = useCallback(
      (optionValue: string) => {
        setLayout(optionValue);
      },
      [setLayout]
    );

    const renderedBadge = useMemo(() => {
      return renderBadge(layout, badgeData);
    }, [renderBadge, layout, badgeData]);

    return (
      <>
        <Box
          paddingBlock="400"
          paddingInline="200"
          background="bg-surface"
          shadow="300"
        >
          <div className="badge-preview-container">
            {badgeLayoutOptions.map((option) => (
              <div
                className="badge-preview-item"
                key={option.value}
                onClick={() => handleLayoutClick(option.value)}
              >
                <div
                  className="badge-preview-item-image"
                  style={{ textAlign: "center" }}
                >
                  {React.cloneElement(option.image, {
                    style: { maxWidth: "100%", height: "auto" },
                  })}
                </div>
                <RadioButton
                  label=""
                  checked={layout === option.value}
                  onChange={() => handleLayoutClick(option.value)}
                  name="badge-layout"
                />
              </div>
            ))}
          </div>
        </Box>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            minHeight: "306px",
          }}
        >
          {renderedBadge}
        </div>
      </>
    );
  }
);

BadgePreview.displayName = "BadgePreview";

export default BadgePreview;
