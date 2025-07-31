import { FormLayout, Select, Text } from "@shopify/polaris";
import type { BadgeData } from "../types/badge.type";

type RatingSelectorProps = {
  badgeData: BadgeData;
  setBadgeData: React.Dispatch<React.SetStateAction<BadgeData>>;
  isValidRating: boolean;
  setIsValidRating: React.Dispatch<React.SetStateAction<boolean>>;
};

function RatingSelector({
  badgeData,
  setBadgeData,
  isValidRating,
  setIsValidRating,
}: RatingSelectorProps) {
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

  return (
    <>
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
    </>
  );
}

export default RatingSelector;
