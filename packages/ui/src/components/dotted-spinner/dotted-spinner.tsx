import {
  chakra,
  forwardRef,
  keyframes,
  omitThemingProps,
  ThemingProps,
  useStyleConfig,
  HTMLChakraProps,
} from "@chakra-ui/react"
import { cx } from "@companydotcom/utils"
// TODO: Remove the workaround whenever MS fixes the issue
// https://github.com/microsoft/TypeScript/issues/48212
import type { ComponentWithAs } from "@chakra-ui/react"

const circleFadeDelay = keyframes({
  "0%": {
    transform: "scale(1)",
  },
  "20%": {
    transform: "scale(1)",
  },
  "50%": { transform: "scale(1.5)" },
  "80%": { transform: "scale(1)" },
  "100%": {
    transform: "scale(1)",
  },
})

interface DottedSpinnerOptions {
  /**
   * The color of the empty area in the spinner
   * @default "transparent"
   */
  emptyColor?: string
  /**
   * The color of the spinner
   */
  color?: string
  /**
   * The thickness of the spinner
   * @default "2px"
   * @example
   * ```jsx
   * <Spinner thickness="4px"/>
   * ```
   */
  thickness?: string
  /**
   * The speed of the spinner.
   * @default "0.45s"
   * @example
   * ```jsx
   * <Spinner speed="0.2s"/>
   * ```
   */
  speed?: string
  /**
   * For accessibility, it is important to add a fallback loading text.
   * This text will be visible to screen readers.
   * @default "Loading..."
   */
  label?: string
}

export interface DottedSpinnerProps
  extends Omit<HTMLChakraProps<"div">, keyof DottedSpinnerOptions>,
    DottedSpinnerOptions,
    ThemingProps<"Spinner"> {}

/**
 * Spinner is used to indicate the loading state of a page or a component,
 * It renders a `div` by default.
 *
 * @see Docs https://chakra-ui.com/spinner
 */
export const DottedSpinner = forwardRef<DottedSpinnerProps, "div">((props, ref) => {
  const styles = useStyleConfig("Spinner", props)

  const {
    label = "Loading...",
    thickness = "2px",
    speed = "0.45s",
    emptyColor = "transparent",
    className,
    ...rest
  } = omitThemingProps(props)

  const _className = cx("dotted-spinner", className)

  const spinnerStyles = {
    display: "inline-block",
    position: "relative",
    width: "80px",
    height: "80px",
    ...styles,
  }

  const childStyles = {
    position: "absolute",
    width: "6px",
    height: "6px",
    background: "#fff",
    borderRadius: "50%",
    animation: `${circleFadeDelay} 1.2s linear infinite`,
  }

  return (
    <chakra.div ref={ref} __css={spinnerStyles} className={_className} {...rest}>
      <chakra.div />
      <chakra.div />
      <chakra.div />
      <chakra.div />
      <chakra.div />
      <chakra.div />
      <chakra.div />
      <chakra.div />
      <chakra.div />
      <chakra.div />
      <chakra.div />
      <chakra.div />
      {label && <chakra.span srOnly>{label}</chakra.span>}
    </chakra.div>
  )
})

DottedSpinner.displayName = "Spinner"

// .dot-spinner {
//     display: inline-block;
//     position: relative;
//     width: 80px;
//     height: 80px;
//   }
//   .dot-spinner div {
//     position: absolute;
//     width: 6px;
//     height: 6px;
//     background: #fff;
//     border-radius: 50%;
//     animation: dot-spinner 1.2s linear infinite;
//   }
//   .dot-spinner div:nth-child(1) {
//     animation-delay: 0s;
//     top: 37px;
//     left: 66px;
//   }
//   .dot-spinner div:nth-child(2) {
//     animation-delay: -0.1s;
//     top: 22px;
//     left: 62px;
//   }
//   .dot-spinner div:nth-child(3) {
//     animation-delay: -0.2s;
//     top: 11px;
//     left: 52px;
//   }
//   .dot-spinner div:nth-child(4) {
//     animation-delay: -0.3s;
//     top: 7px;
//     left: 37px;
//   }
//   .dot-spinner div:nth-child(5) {
//     animation-delay: -0.4s;
//     top: 11px;
//     left: 22px;
//   }
//   .dot-spinner div:nth-child(6) {
//     animation-delay: -0.5s;
//     top: 22px;
//     left: 11px;
//   }
//   .dot-spinner div:nth-child(7) {
//     animation-delay: -0.6s;
//     top: 37px;
//     left: 7px;
//   }
//   .dot-spinner div:nth-child(8) {
//     animation-delay: -0.7s;
//     top: 52px;
//     left: 11px;
//   }
//   .dot-spinner div:nth-child(9) {
//     animation-delay: -0.8s;
//     top: 62px;
//     left: 22px;
//   }
//   .dot-spinner div:nth-child(10) {
//     animation-delay: -0.9s;
//     top: 66px;
//     left: 37px;
//   }
//   .dot-spinner div:nth-child(11) {
//     animation-delay: -1s;
//     top: 62px;
//     left: 52px;
//   }
//   .dot-spinner div:nth-child(12) {
//     animation-delay: -1.1s;
//     top: 52px;
//     left: 62px;
//   }
