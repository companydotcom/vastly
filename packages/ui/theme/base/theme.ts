import { theme, extendTheme, ChakraTheme } from "@chakra-ui/react";

import components from "./components";

export const baseTheme = extendTheme({
  colors: {
    pricing: theme.colors.green[500],
    success: theme.colors.green[500],
    error: theme.colors.red[500],
    warning: theme.colors.yellow[500],
    info: theme.colors.blue[500],
  },

  components,
}) as ChakraTheme;
