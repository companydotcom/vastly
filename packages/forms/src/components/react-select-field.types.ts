import { Props, ThemeSpacing } from "react-select"
import { CSSWithMultiValues } from "@chakra-ui/react"

export type { Theme } from "react-select"

export type { RecursiveCSSObject } from "@chakra-ui/react"

export type Size = "sm" | "md" | "lg"

export type TagVariant = "subtle" | "solid" | "outline" | undefined

export type SelectedOptionStyle = "color" | "check"

export interface PotionSelectProps extends Props {
  size?: Size
  colorScheme?: string
  isInvalid?: boolean
  tagVariant?: TagVariant
  hasStickyGroupHeaders?: boolean
  selectedOptionStyle?: SelectedOptionStyle
  selectedOptionColor?: string
}

export type OptionalTheme = {
  borderRadius?: number
  colors?: { [key: string]: string }
  spacing?: ThemeSpacing
}

export interface SxProps extends CSSWithMultiValues {
  _disabled: CSSWithMultiValues
  _focus: CSSWithMultiValues
}

export type SizeProps = {
  sm: string | number
  md: string | number
  lg: string | number
}
