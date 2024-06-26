import { ChakraTheme, extendTheme } from "@chakra-ui/react";
import components from "./components";
import config from "./config";
import colors from "./foundations/colors";
import semanticTokens from "./foundations/semantic-tokens";

const overrides = {
  config,
  colors,
  components,
  semanticTokens,
};

export const baseTheme = extendTheme(overrides) as ChakraTheme;
