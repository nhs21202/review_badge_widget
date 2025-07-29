import { useState, useEffect, useCallback } from "react";
import {
  BlockStack,
  Checkbox,
  ColorPicker,
  Popover,
  TextField,
  type TextFieldProps,
} from "@shopify/polaris";

function hsbaToRgba(h: number, s: number, v: number, a = 1) {
  let r = 0;
  let g = 0;
  let b = 0;
  const i = Math.floor(h / 60);
  const f = h / 60 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    case 5:
      r = v;
      g = p;
      b = q;
      break;
  }

  r = Math.round(r * 255);
  g = Math.round(g * 255);
  b = Math.round(b * 255);
  const alpha = Math.round(a * 255);

  return { r, g, b, alpha };
}

function rgbaToHex(r: number, g: number, b: number, a: number) {
  const toHex = (n: number) => {
    if (n !== undefined) {
      return n.toString(16).padStart(2, "0");
    }
    return "";
  };
  if (a === 255) {
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
  return `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(a)}`;
}

function hsbaToHex(h: number, s: number, v: number, a = 1) {
  const { r, g, b, alpha } = hsbaToRgba(h, s, v, a);
  return rgbaToHex(r, g, b, alpha);
}

function rgbToHsba(r: number, g: number, b: number, a = 1) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const v = max;

  const delta = max - min;
  s = max === 0 ? 0 : delta / max;

  if (delta !== 0) {
    switch (max) {
      case r:
        h = (g - b) / delta + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / delta + 2;
        break;
      case b:
        h = (r - g) / delta + 4;
        break;
    }
    h /= 6;
  }

  return {
    hue: Math.round(h * 360),
    saturation: Math.round(s * 100) / 100,
    brightness: Math.round(v * 100) / 100,
    alpha: a,
  };
}

function hexToRgbA(hex: string) {
  let r = 0;
  let g = 0;
  let b = 0;
  let a = 1;

  if (!hex || hex === "transparent") {
    return { r: 0, g: 0, b: 0, a: 0 };
  }

  hex = hex.replace("#", "");

  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
  } else if (hex.length === 8) {
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
    a = parseInt(hex.slice(6, 8), 16) / 255;
  }

  return { r, g, b, a };
}

function hexToHsba(hex: string) {
  const { r, g, b, a } = hexToRgbA(hex);
  return rgbToHsba(r, g, b, a);
}

interface ColorPickerCustomProps extends Omit<TextFieldProps, "onChange"> {
  onChange?: (value: string, id: string) => void;
}

const ColorPickerCustomComponent = (props: ColorPickerCustomProps) => {
  const { onChange, id } = props;

  const [popoverActive, setPopoverActive] = useState(false);
  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    []
  );

  const [color, setColor] = useState({
    hue: 300,
    brightness: 1,
    saturation: 0.7,
    alpha: 0.7,
  });

  const [checked, setChecked] = useState(false);
  const [textFieldValue, setTextFieldValue] = useState(props.value || "");

  const handleChangeColor = useCallback(
    (value: {
      hue: number;
      saturation: number;
      brightness: number;
      alpha: number;
    }) => {
      setColor(value);
      const valueHex = hsbaToHex(
        value.hue,
        value.saturation,
        value.brightness,
        value.alpha
      );
      setTextFieldValue(valueHex);
      const idValue = id || "";
      setChecked(false);
      onChange?.(valueHex, idValue);
    },
    [onChange, id]
  );

  const handleTextFieldChange = useCallback(
    (value: string) => {
      setTextFieldValue(value);
      const id = props.id || "";

      // Try to parse the hex value and update color picker
      if (
        value &&
        value !== "transparent" &&
        /^#[0-9A-Fa-f]{3,8}$/.test(value)
      ) {
        try {
          const newColor = hexToHsba(value);
          setColor(newColor);
        } catch (error) {
          console.warn("Invalid hex color:", value, error);
        }
      }

      props.onChange?.(value, id);
    },
    [props.onChange, props.id]
  );

  const handleTransparentChange = useCallback(
    (newChecked: boolean) => {
      setChecked(newChecked);
      const id = props.id || "";

      if (newChecked) {
        setTextFieldValue("transparent");
        props.onChange?.("transparent", id);
      } else {
        const currentHex = hsbaToHex(
          color.hue,
          color.saturation,
          color.brightness,
          color.alpha
        );
        setTextFieldValue(currentHex);
        props.onChange?.(currentHex, id);
      }
    },
    [color, props.onChange, props.id]
  );

  // Initialize values from props
  useEffect(() => {
    if (props.value !== undefined) {
      setTextFieldValue(props.value);

      if (props.value.toLowerCase() === "transparent") {
        setChecked(true);
      } else if (props.value && /^#[0-9A-Fa-f]{3,8}$/.test(props.value)) {
        try {
          const newColor = hexToHsba(props.value);
          setColor(newColor);
          setChecked(false);
        } catch (error) {
          console.warn("Invalid hex color in props:", props.value, error);
        }
      }
    }
  }, [props.value]);

  const classPickerBorderWhite =
    textFieldValue?.toLowerCase() === "#ffffff" ||
    textFieldValue?.toLowerCase() === "#fff"
      ? "ot-color-picker__preview ot-color-picker__preview-border"
      : "";

  const classPickerBorderTransparent =
    textFieldValue?.toLowerCase() === "transparent"
      ? "ot-color-picker__preview ot-color-picker__preview-border-transparent"
      : "";

  const connectedLeft = (
    <div
      style={{
        backgroundColor:
          textFieldValue === "transparent" ? "transparent" : textFieldValue,
        width: "32px",
        height: "32px",
        border: "1px solid #ccc",
        cursor: props.disabled ? "not-allowed" : "pointer",
        borderRadius: "50%",
      }}
      onClick={() => {
        if (!props.disabled) {
          togglePopoverActive();
        }
      }}
      className={`ot-color-picker__preview ${classPickerBorderWhite} ${classPickerBorderTransparent}`}
    />
  );

  const getValueTextField = () => {
    return textFieldValue?.toUpperCase() || "";
  };

  return (
    <Popover
      active={popoverActive}
      activator={
        <div className="ot-color-picker">
          <TextField
            type="text"
            connectedLeft={connectedLeft}
            {...props}
            onChange={handleTextFieldChange}
            value={getValueTextField()}
          />
        </div>
      }
      onClose={togglePopoverActive}
      ariaHaspopup={false}
      sectioned
    >
      <BlockStack gap="200">
        <ColorPicker onChange={handleChangeColor} color={color} allowAlpha />

        <Checkbox
          label="Transparent"
          checked={checked}
          onChange={handleTransparentChange}
        />
      </BlockStack>
    </Popover>
  );
};

const ColorPickerCustom = ColorPickerCustomComponent;
export default ColorPickerCustom;
