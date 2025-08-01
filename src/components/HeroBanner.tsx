import { BlockStack, Box, Button } from "@shopify/polaris";

const HeroBanner = () => {
  return (
    <div className="banner-section">
      <div className="banner-container">
        <Box padding="800">
          <BlockStack gap="500" align="center">
            <h1 className="banner-title">
              Add Reviews Badge Widget on Your Website
            </h1>
            <h2 className="banner-subtitle">
              Aggregate and add Review badge on your website automatically and
              in seconds.
            </h2>
            <div className="button-container">
              <Button
                variant="primary"
                size="large"
                onClick={() =>
                  window.open(
                    "https://apps.shopify.com/trustify?utm_source=trustifywebsite&utm_medium=free-tool-generate-review-badge&utm_id=crs",
                    "_blank"
                  )
                }
              >
                Install with Shopify store
              </Button>
            </div>
          </BlockStack>
        </Box>
      </div>
    </div>
  );
};

export default HeroBanner;
