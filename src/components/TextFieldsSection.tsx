import { TextField } from "@shopify/polaris";
import {
  useForm,
  Controller,
  type ControllerRenderProps,
} from "react-hook-form";
import { useEffect } from "react";
import type { BadgeData } from "../types/badge.type";
import { URL_REGEX } from "../constant/regex";

type TextFieldsSectionProps = {
  badgeData: BadgeData;
  setBadgeData: React.Dispatch<React.SetStateAction<BadgeData>>;
  layout: string;
};

function TextFieldsSection({
  badgeData,
  setBadgeData,
  layout,
}: TextFieldsSectionProps) {
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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
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
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
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
        render={({
          field,
        }: {
          field: ControllerRenderProps<{ openLink: string }, "openLink">;
        }) => (
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
    </div>
  );
}

export default TextFieldsSection;
