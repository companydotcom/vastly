import { cssVar, SystemStyleObject } from "@companydotcom/potion";

// const $size = cssVar('spinner-size');

// const sizes: Record<string, SystemStyleObject> = {
//   xs: {
//     [$size.variable]: '0.75rem',
//   },
//   sm: {
//     [$size.variable]: '1rem',
//   },
//   md: {
//     [$size.variable]: '1.5rem',
//   },
//   lg: {
//     [$size.variable]: '2rem',
//   },
//   xl: {
//     [$size.variable]: '3rem',
//   },
// };

const baseStyle = (props: any) => {
  const { color, thickness, emptyColor } = props;
  return {
    // width: [$size.reference],
    // height: [$size.reference],
    color,
    borderWidth: thickness,
    borderBottomColor: emptyColor,
    borderLeftColor: emptyColor,
  };
};

const defaultProps = {
  size: "xl",
  thickness: "4px",
  color: "gray.400",
  emptyColor: "gray.200",
};

export default {
  baseStyle,
  defaultProps,
  // sizes,
};
