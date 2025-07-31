import { BlockStack, Box, Button } from "@shopify/polaris";
import { useState, useEffect } from "react";
import type { BadgeData } from "../types/badge.type";
import { generateBadgeHTML } from "../utils/htmlGenerator";
import HTMLDisplay from "./HTMLDisplay";
import { BRANDING_STATEMENT } from "../constant/branding";

type HTMLCodeSectionProps = {
  badgeData: BadgeData;
  setBadgeData: React.Dispatch<React.SetStateAction<BadgeData>>;
  layout: string;
};

function HTMLCodeSection({
  badgeData,
  setBadgeData,
  layout,
}: HTMLCodeSectionProps) {
  const [generatedHTML, setGeneratedHTML] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isHTMLDisplayOpen, setIsHTMLDisplayOpen] = useState(false);

  // Close HTML display when layout changes
  useEffect(() => {
    setIsHTMLDisplayOpen(false);
  }, [layout]);

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
  );
}

export default HTMLCodeSection;
