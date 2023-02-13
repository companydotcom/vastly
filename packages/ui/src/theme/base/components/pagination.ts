import { createMultiStyleConfigHelpers } from "@chakra-ui/styled-system"
import type { StyleFunctionProps } from "@chakra-ui/styled-system"

const helpers = createMultiStyleConfigHelpers([
  "root",
  "container",
  "prevButton",
  "nextButton",
  "page",
])

function variantGhost(props: StyleFunctionProps) {
  const { colorScheme: c } = props

  if (c === "gray") {
    return {
      page: {
        color: `inherit`,
        bg: "transparent",
        _hover: {
          bg: `gray.100`,
        },
        _active: { bg: `gray.200` },
        _current: { bg: `gray.400` },
      },
    }
  }

  return {
    page: {
      color: `${c}.600`,
      bg: "white",
      _hover: {
        bg: `${c}.50`,
      },
      _active: {
        bg: `${c}.100`,
      },
      _current: {
        bg: `${c}.500`,
        color: "white",
      },
    },
  }
}

function variantOutline(props: StyleFunctionProps) {
  const { colorScheme: c } = props
  const borderColor = `gray.200`
  const ghostStyles = variantGhost(props).page
  return {
    page: {
      border: "1px solid",
      borderColor: c === "gray" ? borderColor : "currentColor",
      ...ghostStyles,
    },
  }
}

const variantUnstyled = {
  page: {
    bg: "none",
    color: "inherit",
    display: "inline",
    lineHeight: "inherit",
    m: 0,
    p: 0,
  },
}

export const Pagination = helpers.defineMultiStyleConfig({
  baseStyle: {
    page: {
      lineHeight: "1.2",
      borderRadius: "md",
      fontWeight: "semibold",
      transitionProperty: "common",
      transitionDuration: "normal",
      _focus: {
        boxShadow: "outline",
      },
      _disabled: {
        opacity: 0.5,
        boxShadow: "none",
        cursor: "not-allowed",
      },
      _hover: {
        background: "initial",
        _disabled: {
          bg: "initial",
        },
      },
    },
  },
  sizes: {
    lg: {
      page: {
        h: 12,
        minW: 12,
        fontSize: "lg",
        px: 6,
      },
    },
    md: {
      page: {
        h: 10,
        minW: 10,
        fontSize: "md",
        px: 4,
      },
    },
    sm: {
      page: {
        h: 8,
        minW: 8,
        fontSize: "sm",
        px: 3,
      },
    },
    xs: {
      page: {
        h: 6,
        minW: 6,
        fontSize: "xs",
        px: 2,
      },
    },
  },
  variants: {
    ghost: (props: StyleFunctionProps) => variantGhost(props),
    outline: (props: StyleFunctionProps) => variantOutline(props),
    unstyled: variantUnstyled,
  },
  defaultProps: {
    size: "md",
    variant: "outline",
    colorScheme: "blue",
  },
})
