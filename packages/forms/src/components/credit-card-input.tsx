import valid from "card-validator";
import { forwardRef, Input, InputProps as ChakraInputProps } from "@chakra-ui/react";
import { PatternFormat, PatternFormatProps } from "react-number-format";
// TODO: Remove the workaround whenever MS fixes the issue
// https://github.com/microsoft/TypeScript/issues/48212
import type { ComponentWithAs } from "@chakra-ui/react";

const getFormatForCard = (
  cardNumber: string | number | readonly string[] | undefined,
  patternChar?: string,
) => {
  const card = valid?.number(cardNumber)?.card;
  const char = patternChar || "#";

  if (card) {
    const pattern = char.repeat(card.lengths.at(-1) ?? 16);
    const splitPattern = pattern.split("");
    const splitPatternGaps = card.gaps;

    for (let i = splitPatternGaps.length - 1; i >= 0; i--) {
      if (splitPatternGaps[i] < pattern.length) {
        splitPattern.splice(splitPatternGaps[i], 0, " ");
      }
    }

    return splitPattern.join("");
  }

  return char.repeat(16);
};

export interface CreditCardInputProps
  extends ChakraInputProps,
    Omit<
      PatternFormatProps,
      "color" | "defaultValue" | "height" | "size" | "type" | "value" | "width"
    > {}

export const CreditCardInput = forwardRef<CreditCardInputProps, "div">((props, ref) => {
  const { format, value, patternChar, ...rest } = props;

  return (
    <Input
      getInputRef={ref}
      as={PatternFormat}
      value={value}
      format={format || getFormatForCard(value, patternChar)}
      {...rest}
    />
  );
});
