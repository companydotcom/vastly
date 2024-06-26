import { forwardRef, Input, InputProps as ChakraInputProps } from "@vastly/ui";
import { NumberFormatBase, PatternFormatProps, usePatternFormat } from "react-number-format";
// TODO: Remove the workaround whenever MS fixes the issue
// https://github.com/microsoft/TypeScript/issues/48212
import type { ComponentWithAs } from "@vastly/ui";

export interface CardExpiryInputProps extends Omit<PatternFormatProps<ChakraInputProps>, "format"> {
  format?: string;
}

export const CardExpiryInput = forwardRef<CardExpiryInputProps, "div">((props, ref) => {
  /**
   * usePatternFormat, returns all the props required for NumberFormatBase
   * which we can extend in between
   */
  const { format, ...rest } = usePatternFormat({
    ...props,
    format: "##/##",
  });

  const _format = (val: string | number) => {
    if (typeof val === "number") {
      val = val.toString();
    }
    let month = val.substring(0, 2);
    const year = val.substring(2, 4);

    if (month.length === 1 && Number(month[0]) > 1) {
      month = `0${month[0]}`;
    } else if (month.length === 2) {
      // set the lower and upper boundary
      if (Number(month) === 0) {
        month = `01`;
      } else if (Number(month) > 12) {
        month = "12";
      }
    }
    // @ts-ignore
    return format(`${month}${year}`);
  };

  return (
    <NumberFormatBase
      getInputRef={ref}
      customInput={Input}
      format={_format}
      placeholder={props.placeholder || "MM/YY"}
      {...rest}
    />
  );
});
