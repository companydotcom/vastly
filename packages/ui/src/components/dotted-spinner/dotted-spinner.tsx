import {
  chakra,
  forwardRef,
  omitThemingProps,
  ThemingProps,
  useStyleConfig,
  HTMLChakraProps,
} from "@chakra-ui/react";
import { cx } from "@companydotcom/utils";
// TODO: Remove the workaround whenever MS fixes the issue
// https://github.com/microsoft/TypeScript/issues/48212
import type { ComponentWithAs } from "@chakra-ui/react";

interface DottedSpinnerOptions {
  /**
   * The color of the spinner
   */
  color?: string;
  /**
   * The speed of the spinner.
   * @default "1.2s"
   * @example
   * ```jsx
   * <Spinner speed="0.2s"/>
   * ```
   */
  speed?: string;
  /**
   * For accessibility, it is important to add a fallback loading text.
   * This text will be visible to screen readers.
   * @default "Loading..."
   */
  label?: string;
}

export interface DottedSpinnerProps
  extends Omit<HTMLChakraProps<"div">, keyof DottedSpinnerOptions>,
    DottedSpinnerOptions,
    ThemingProps<"Spinner"> {}

/**
 * DottedSpinner is used to indicate the loading state of a page or a component,
 * It renders a `div` by default.
 *
 * @see Docs https://chakra-ui.com/spinner
 */
export const DottedSpinner = forwardRef<DottedSpinnerProps, "div">((props, ref) => {
  const styles = useStyleConfig("DottedSpinner", props);
  const {
    label = "Loading...",
    speed = "1.2s",
    className,
    color = "blue.500",
    ...rest
  } = omitThemingProps(props);

  const _className = cx("dotted-spinner", className);

  const spinnerStyles = {
    display: "inline-block",
    position: "relative",
    fill: color,
    ...styles,
  };

  // Spinner animation and style courtesy of https://github.com/n3r4zzurr0/svg-spinners

  return (
    <chakra.div ref={ref} className={_className} __css={spinnerStyles} {...rest}>
      <chakra.svg viewBox="0 0 24 24">
        <style>
          {`.spinner_EUy1{animation:spinner_grm3 ${speed} infinite}.spinner_f6oS{animation-delay:.1s}
        .spinner_g3nX{animation-delay:.2s}.spinner_nvEs{animation-delay:.3s}.spinner_MaNM
        {animation-delay:.4s}.spinner_4nle{animation-delay:.5s}.spinner_ZETM
        {animation-delay:.6s}.spinner_HXuO{animation-delay:.7s}.spinner_YaQo
        {animation-delay:.8s}.spinner_GOx1{animation-delay:.9s}.spinner_4vv9
        {animation-delay:1s}.spinner_NTs9{animation-delay:1.1s}.spinner_auJJ
        {transform-origin:center;animation:spinner_T3O6 6s linear infinite}@keyframes spinner_grm3
        {0%,50%{animation-timing-function:cubic-bezier(.27,.42,.37,.99);r:1px}25%{animation-timing-function:cubic-bezier(.53,0,.61,.73);r:2px}}@keyframes spinner_T3O6{0%{transform:rotate(360deg)}100%{transform:rotate(0deg)}}
      `}
        </style>
        <g className="spinner_auJJ">
          <circle className="spinner_EUy1" cx="12" cy="3" r="1" />
          <circle className="spinner_EUy1 spinner_f6oS" cx="16.50" cy="4.21" r="1" />
          <circle className="spinner_EUy1 spinner_NTs9" cx="7.50" cy="4.21" r="1" />
          <circle className="spinner_EUy1 spinner_g3nX" cx="19.79" cy="7.50" r="1" />
          <circle className="spinner_EUy1 spinner_4vv9" cx="4.21" cy="7.50" r="1" />
          <circle className="spinner_EUy1 spinner_nvEs" cx="21.00" cy="12.00" r="1" />
          <circle className="spinner_EUy1 spinner_GOx1" cx="3.00" cy="12.00" r="1" />
          <circle className="spinner_EUy1 spinner_MaNM" cx="19.79" cy="16.50" r="1" />
          <circle className="spinner_EUy1 spinner_YaQo" cx="4.21" cy="16.50" r="1" />
          <circle className="spinner_EUy1 spinner_4nle" cx="16.50" cy="19.79" r="1" />
          <circle className="spinner_EUy1 spinner_HXuO" cx="7.50" cy="19.79" r="1" />
          <circle className="spinner_EUy1 spinner_ZETM" cx="12" cy="21" r="1" />
        </g>
      </chakra.svg>
    </chakra.div>
  );
});

DottedSpinner.displayName = "DottedSpinner";
