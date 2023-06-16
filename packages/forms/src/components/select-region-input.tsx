import {
  forwardRef,
  Select as ChakraSelect,
  SelectProps as ChakraSelectProps,
} from "@vastly/ui";
import { RegionDropdown, RegionDropdownProps } from "react-country-region-selector";

// TODO: Remove the workaround whenever MS fixes the issue
// https://github.com/microsoft/TypeScript/issues/48212
import type { ComponentWithAs } from "@vastly/ui";

export interface SelectRegionInputProps
  extends ChakraSelectProps,
    Omit<RegionDropdownProps, "onChange" | "onBlur" | "value"> {}

export const SelectRegionInput = forwardRef<SelectRegionInputProps, "div">((props, ref) => {
  return <ChakraSelect ref={ref} as={RegionDropdown} countryValueType="short" {...props} />;
});
