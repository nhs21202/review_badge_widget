import "./App.css";
import {
  Box,
  BlockStack,
  Card,
  Grid,
  InlineGrid,
  Text,
  Divider,
  FormLayout,
  ChoiceList,
  TextField,
  Select,
} from "@shopify/polaris";
import HeroBanner from "./components/HeroBanner";
import { useState } from "react";

function App() {
  const [logo, setLogo] = useState<string>("show-logo");
  const [otherLogo, setOtherLogo] = useState<string>("");
  const [firstSelect, setFirstSelect] = useState<string>("5");
  const [secondSelect, setSecondSelect] = useState<string>(".0");
  const [isValidRating, setIsValidRating] = useState<boolean>(true);
  const [text, setText] = useState<string>("From 100 verified reviews");
  const [openLink, setOpenLink] = useState<string>("");
  const handleFirstSelectChange = (value: string) => {
    const newRating = parseFloat(value + secondSelect);
    if (newRating <= 5.0) {
      setFirstSelect(value);
      setIsValidRating(true);
    } else {
      if (value === "5") {
        setFirstSelect(value);
        setSecondSelect(".0");
        setIsValidRating(false);
      }
    }
  };

  const handleSecondSelectChange = (value: string) => {
    const newRating = parseFloat(firstSelect + value);
    if (newRating <= 5.0) {
      setSecondSelect(value);
      setIsValidRating(true);
    } else {
      setIsValidRating(false);
    }
  };

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
                    <ChoiceList
                      title="Logo"
                      choices={[
                        { label: "Google", value: "show-logo" },
                        { label: "Facebook", value: "hide-logo" },
                        { label: "Other", value: "other-logo" },
                      ]}
                      selected={logo ? [logo] : ["show-logo"]}
                      onChange={(value) => setLogo(value[0])}
                    />
                    {logo === "other-logo" && (
                      <TextField
                        autoComplete="off"
                        label="Other logo"
                        value={otherLogo}
                        onChange={(value) => setOtherLogo(value)}
                      />
                    )}
                    <FormLayout.Group condensed title="Average rating">
                      <Select
                        label=""
                        options={["1", "2", "3", "4", "5"]}
                        value={firstSelect}
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
                        value={secondSelect}
                        error={!isValidRating}
                        onChange={(value) => handleSecondSelectChange(value)}
                      />
                    </FormLayout.Group>
                    {!isValidRating && (
                      <Text variant="bodyMd" as="p" tone="critical">
                        Rating must be less than or equal to 5.0.
                      </Text>
                    )}
                    <TextField
                      autoComplete="off"
                      label="Text"
                      value={text}
                      onChange={(value) => setText(value)}
                    />
                    <TextField
                      autoComplete="off"
                      label="Open link when click on the badge"
                      value={openLink}
                      onChange={(value) => setOpenLink(value)}
                    />
                  </FormLayout>
                </Box>
              </Card>
            </Box>
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 1, sm: 1, md: 6, lg: 7, xl: 7 }}>
            <Box>
              <Card padding="0">
                <BlockStack gap="200">
                  <Box
                    paddingBlock="400"
                    paddingInline="500"
                    background="bg-fill-secondary"
                  >
                    <Text variant="headingMd" as="h2">
                      Product details
                    </Text>
                  </Box>
                  <Divider />
                </BlockStack>
              </Card>
            </Box>
          </Grid.Cell>
        </InlineGrid>
      </div>
    </div>
  );
}

export default App;
