import { createMultiStyleConfigHelpers, defineStyle } from "@chakra-ui/styled-system";
import { mode, orient } from "@chakra-ui/theme-tools";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers([
  "container",
  "steps",
  "icon",
  "content",
  "separator",
  "title",
]);

const contentBaseStyle = defineStyle((props) => {
  const { orientation, size } = props;
  const borderWidth = size === "lg" ? 2 : 1;

  return orient({
    orientation,
    vertical: {
      borderLeftWidth: borderWidth,
      ms: size === "lg" ? 4 : 3,
      ps: 5,
    },
    horizontal: {},
  });
});

const stepsBaseStyle = defineStyle((props) => {
  const { orientation } = props;

  return orient({
    orientation,
    vertical: {
      flexDirection: "column",
      alignItems: "stretch",
    },
    horizontal: {
      flexDirection: "row",
      alignItems: { base: "flex-start", sm: "center" },
      position: "relative",
    },
  });
});

const stepBaseStyle = defineStyle((props) => {
  const { orientation, size } = props;
  const borderWidth = size === "lg" ? 2 : 1;

  return orient({
    orientation,
    vertical: {
      flexDirection: "row",
    },
    horizontal: {
      flexDirection: { base: "column" },
      flex: { base: "1 1", sm: "inherit" },
      position: "relative",
      _before: {
        content: '""',
        transitionProperty: "common",
        transitionDuration: "normal",
        borderTopWidth: borderWidth,
        borderColor: "inherit",
        display: "block",
        position: { base: "absolute", sm: "static" },

        left: { base: "calc(-50% + 24px)", sm: 0 },
        right: { base: "calc(50% + 24px)", sm: 0 },
        top: 6,
      },
      "&:first-of-type:before": {
        display: "none",
      },
    },
  });
});

const titleBaseStyle = defineStyle((props) => {
  const { orientation } = props;

  return orient({
    orientation,
    vertical: {},
    horizontal: {
      mt: { base: 2, sm: 0 },
      textAlign: "center",
    },
  });
});

const separatorBaseStyle = defineStyle((props) => {
  const { orientation, size } = props;
  const borderWidth = size === "lg" ? 2 : 1;

  return orient({
    orientation,
    vertical: {
      minHeight: 4,
      borderLeftWidth: borderWidth,
      borderTopWidth: 0,
      mx: size === "lg" ? 4 : 3,
    },
    horizontal: {
      borderTopWidth: borderWidth,
      mx: { base: 0, sm: 3 },
      mt: { base: 5, sm: 0 },
      mb: { base: 6 },
      alignSelf: { base: "flex-start", sm: "center" },
      flex: { base: "inherit", sm: 1 },
    },
  });
});

const iconBaseStyle = defineStyle((props) => {
  const { orientation } = props;

  return orient({
    orientation,
    vertical: {
      me: 2,
    },
    horizontal: {
      me: { base: 0 },
    },
  });
});

const baseStyle = definePartsStyle((props) => ({
  container: {
    flexDirection: "column",
  },
  content: contentBaseStyle(props),
  steps: stepsBaseStyle(props),
  step: { ...stepBaseStyle(props), py: 2 },
  title: titleBaseStyle(props),
  separator: {
    ...separatorBaseStyle(props),
    transitionProperty: "common",
    transitionDuration: "normal",
  },
  icon: {
    ...iconBaseStyle(props),
    bg: "whiteAlpha.400",
    lineHeight: 1,
    flexShrink: 0,
    transitionProperty: "common",
    transitionDuration: "normal",
  },
}));

const variantSubtle = defineStyle((props) => {
  const { colorScheme: c } = props;

  return {
    icon: {
      bg: mode("blackAlpha.300", "whiteAlpha.200")(props),
      color: mode("blackAlpha.600", "whiteAlpha.600")(props),
      "[data-active] &": {
        bg: `${c}.100`,
        color: mode(`${c}.500`, `${c}.200`)(props),
      },
      "[data-completed] &": {
        bg: `${c}.100`,
        color: mode(`${c}.500`, `${c}.200`)(props),
      },
    },
  };
});

const variantSolid = defineStyle((props) => {
  const { colorScheme: c } = props;

  return {
    icon: {
      bg: `gray.200`,
      color: "gray.800",
      "[data-active] &": {
        bg: mode(`${c}.500`, `${c}.200`)(props),
        color: "white",
      },
      "[data-completed] &": {
        bg: mode(`${c}.500`, `${c}.200`)(props),
        color: "white",
      },
    },
    separator: {
      "&[data-active]": {
        borderColor: mode(`${c}.500`, `${c}.200`)(props),
      },
    },
    step: {
      "&[data-active]:before, &[data-completed]:before": {
        borderColor: mode(`${c}.500`, `${c}.200`)(props),
      },
    },
  };
});

const variants = {
  subtle: definePartsStyle((props) => ({ ...variantSubtle(props) })),
  solid: definePartsStyle((props) => ({ ...variantSolid(props) })),
};

const sizes = {
  md: definePartsStyle({
    icon: {
      boxSize: 6,
      fontSize: "sm",
    },
    title: {
      fontSize: "xs",
    },
    step: {
      _before: {
        top: 5,
      },
    },
  }),
  lg: definePartsStyle({
    icon: {
      boxSize: 10,
    },
    title: {
      mt: 2,
      fontSize: "sm",
    },
  }),
};

export const NumberStepper = defineMultiStyleConfig({
  baseStyle,
  variants,
  sizes,
  defaultProps: {
    variant: "solid",
    colorScheme: "blue",
    size: "lg",
  },
});
