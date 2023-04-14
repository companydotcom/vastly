import { defineStyleConfig, defineStyle, cssVar } from "@chakra-ui/react";

const $size = cssVar("dotted-spinner-size");

const baseStyle = defineStyle({
  width: [$size.reference],
  height: [$size.reference],
});

const sizes = {
  xs: defineStyle({
    [$size.variable]: "sizes.6",
  }),
  sm: defineStyle({
    [$size.variable]: "sizes.8",
  }),
  md: defineStyle({
    [$size.variable]: "sizes.16",
  }),
  lg: defineStyle({
    [$size.variable]: "sizes.24",
  }),
  xl: defineStyle({
    [$size.variable]: "sizes.32",
  }),
};

export const DottedSpinner = defineStyleConfig({
  // Styles for the base style
  baseStyle,
  // Styles for the size variations
  sizes,
  // The default `size` or `variant` values
  defaultProps: {
    size: "md",
  },
});
