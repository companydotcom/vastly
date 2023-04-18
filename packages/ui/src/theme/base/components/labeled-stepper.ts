import { createMultiStyleConfigHelpers, defineStyle } from "@chakra-ui/styled-system";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers([
  "container",
  "steps",
  "icon",
  "content",
  "separator",
  "title",
  "step",
]);

const stepsBaseStyle = defineStyle({
  justifyContent: "center",
  gap: "1",
});

const separatorBaseStyle = defineStyle((props) => {
  const { colorScheme: c } = props;

  return {
    height: "10px",
    width: "full",
    backgroundColor: "gray.300",
    "[data-active] &": {
      backgroundColor: `${c}.500`,
    },
    "[data-completed] &": {
      backgroundColor: `${c}.600`,
    },
  };
});

const stepBaseStyle = defineStyle({
  minWidth: "144px",
  "&:first-of-type .dxp-ui-labeledStepper__separator": {
    borderTopLeftRadius: "full",
    borderBottomLeftRadius: "full",
  },
  "&:last-of-type .dxp-ui-labeledStepper__separator": {
    borderTopRightRadius: "full",
    borderBottomRightRadius: "full",
  },
});

const titleBaseStyle = defineStyle((props) => {
  const { colorScheme: c } = props;

  return {
    fontWeight: "medium",
    fontSize: "sm",
    mb: "1",
    color: "gray.300",
    "[data-active] &": {
      color: `${c}.500`,
    },
    "[data-completed] &": {
      color: `${c}.600`,
    },
  };
});

const baseStyle = definePartsStyle((props) => ({
  steps: stepsBaseStyle,
  separator: separatorBaseStyle(props),
  step: { ...stepBaseStyle, py: 2 },
  title: titleBaseStyle(props),
}));

export const LabeledStepper = defineMultiStyleConfig({
  baseStyle,
  defaultProps: {
    colorScheme: "blue",
  },
});
