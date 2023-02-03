import { extendTheme, ChakraProvider, ChakraProviderProps } from "@chakra-ui/react"
// import { Maybe, ThemeExtension } from "@companydotcom/types";
// import { baseTheme, potionTheme } from "../../theme";
// import { mapThemeExtensions } from "../../utils";

export interface UiProviderProps extends ChakraProviderProps {
  overrides?: Record<string, any>
  // extensions?: Maybe<Maybe<ThemeExtension>[]>;
}

export function UiProvider({
  children,
  overrides,
  // extensions,
  ...rest
}: UiProviderProps) {
  // const themeOverrides = mergeThemeOverride(baseTheme, potionTheme, overrides) as ChakraTheme;

  // const themeExtensions = mapThemeExtensions(extensions);

  return (
    <ChakraProvider theme={overrides ? extendTheme(overrides) : undefined} {...rest}>
      {children}
    </ChakraProvider>
  )
}
