import * as React from "react";
import {
  extendTheme,
  ChakraProvider,
  ChakraProviderProps,
  mergeThemeOverride,
  ChakraTheme,
} from "@chakra-ui/react";
import { Maybe, ThemeExtension } from "@companydotcom/types";
import { baseTheme, potionTheme } from "../../theme";
import { mapThemeExtensions } from "../../utils";

export interface PotionProviderProps extends ChakraProviderProps {
  overrides?: ChakraTheme;
  extensions?: Maybe<Maybe<ThemeExtension>[]>;
}

export function PotionProvider({ children, overrides, extensions, ...rest }: PotionProviderProps) {
  const themeOverrides = mergeThemeOverride(baseTheme, potionTheme, overrides) as ChakraTheme;

  const themeExtensions = mapThemeExtensions(extensions);

  return (
    <ChakraProvider theme={extendTheme(themeOverrides, ...themeExtensions)} {...rest}>
      {children}
    </ChakraProvider>
  );
}
