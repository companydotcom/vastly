import * as R from "remeda"
import { ThemeExtension, Maybe } from "@companydotcom/types"
import {
  withDefaultColorScheme,
  withDefaultVariant,
  withDefaultSize,
  withDefaultProps,
} from "@chakra-ui/react"

/**
 * Maps extensions from DynamoDB to a readable format for Coco-ui
 */
export function mapThemeExtensions(
  extensions?: Maybe<Array<Maybe<ThemeExtension>>>,
) {
  if (!R.isArray(extensions)) {
    throw new Error("Extensions must be an array")
  }

  if (!extensions) {
    return []
  }

  return extensions.map((ext) => {
    if (ext) {
      switch (ext.name) {
        case "withDefaultColorScheme":
          return withDefaultColorScheme({
            colorScheme: ext?.colorScheme ?? undefined,
            components: ext?.components ?? undefined,
          })
        case "withDefaultVariant":
          return withDefaultVariant({
            variant: ext.variant ?? undefined,
            components: ext.components ?? undefined,
          })
        case "withDefaultSize":
          return withDefaultSize({
            size: ext.size ?? undefined,
            components: ext.components ?? undefined,
          })
        case "withDefaultProps":
          return withDefaultProps({
            // @ts-ignore
            defaultProps: ext.defaultProps ?? undefined,
            components: ext.components ?? undefined,
          })
        default:
          throw new Error(
            `"${ext.name}" is not a valid extension name. Did you check your spelling?`,
          )
      }
    }
    return []
  })
}
