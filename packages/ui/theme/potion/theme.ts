import { extendTheme } from "@chakra-ui/react";
import { fonts, textStyles } from "./foundations/typography";
import layerStyles from "./layer-styles";
import shadows from "./foundations/shadows";
import styles from "./styles";
import components from "./components";

const config = {
  useSystemColorMode: false,
  cssVarPrefix: "potion",
};

export const potionTheme = extendTheme({
  components,
  config,
  fonts,
  textStyles,
  layerStyles,
  styles,
  shadows,
});
