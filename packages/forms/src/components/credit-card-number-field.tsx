import React from "react"
import valid from "card-validator"
import { ReactNumberFormatField, ReactNumberFormatFieldProps } from "./react-number-format-field"

/**
 * Adds the appropriate spaces as  determined  by the card-validator library
 * @param value
 * @returns
 */
export const addSpaces = (value: string) => {
  const card = valid.number(value?.substring(0, 2)).card
  const words = [value?.slice(0, card?.gaps[0])]

  if (card?.gaps) {
    for (let i = 1; i < card?.gaps?.length; i++) {
      words.push(value?.slice(card?.gaps[i - 1], card?.gaps[i]))
    }
    words.push(value?.slice(card?.gaps[card?.gaps.length - 1], value?.length))
  }

  const numOfSpaces = countAllSpacesInString(words.join(" ")) ?? 0

  return words.join(" ").substring(0, (card?.lengths[card.lengths.length - 1] ?? 16) + numOfSpaces)
}

export interface CreditCardNumberInputProps extends ReactNumberFormatFieldProps {}

export const CreditCardNumberInput: React.FC<CreditCardNumberInputProps> = ({
  control,
  name,
  ...rest
}) => {
  return (
    <ReactNumberFormatField
      name={name}
      type="text"
      format={addSpaces}
      removeFormatting={removeAllSpacesFromString}
      control={control}
      {...rest}
    />
  )
}

export const removeAllSpacesFromString = (value: string) => {
  return value.replace(/\s/g, "")
}

export const countAllSpacesInString = (value: string) => {
  return value.split(" ").length - 1
}

// const gapsMap = {
//   visa: {
//     gaps: [4, 8, 12],
//     lengths: [16, 18, 19],
//   },
//   mastercard: {
//     gaps: [4, 8, 12],
//     lengths: [16],
//   },
//   amex: {
//     gaps: [4, 10],
//     lengths: [15],
//   },
// };
