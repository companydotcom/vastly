import { createMultiStyleConfigHelpers, defineStyle } from "@chakra-ui/styled-system"

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers([
  "container",
  "steps",
  "icon",
  "content",
  "separator",
  "title",
  "step",
])

const stepsBaseStyle = defineStyle({
  justifyContent: "center",
  gap: "1",
})

const separatorBaseStyle = defineStyle((props) => {
  const { colorScheme: c } = props

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
  }
})

const stepBaseStyle = defineStyle({
  minWidth: "144px",
})

const titleBaseStyle = defineStyle({})

const baseStyle = definePartsStyle((props) => ({
  steps: stepsBaseStyle,
  separator: separatorBaseStyle(props),
  step: stepBaseStyle,
  title: titleBaseStyle,
}))

export const LabeledStepper = defineMultiStyleConfig({
  baseStyle,
  // variants,
  // sizes,
  defaultProps: {
    colorScheme: "blue",
  },
})
