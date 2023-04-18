import {
  forwardRef,
  Select as ChakraSelect,
  SelectProps as ChakraSelectProps,
} from "@chakra-ui/react";
import { CountryDropdown, CountryDropdownProps } from "react-country-region-selector";

// TODO: Remove the workaround whenever MS fixes the issue
// https://github.com/microsoft/TypeScript/issues/48212
import type { ComponentWithAs } from "@chakra-ui/react";

export interface SelectCountryInputProps
  extends ChakraSelectProps,
    Omit<CountryDropdownProps, "onChange" | "onBlur" | "value"> {}

export const SelectCountryInput = forwardRef<SelectCountryInputProps, "div">((props, ref) => {
  return <ChakraSelect ref={ref} as={CountryDropdown} {...props} />;
});
