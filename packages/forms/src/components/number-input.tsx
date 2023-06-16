import * as React from "react";

import {
  forwardRef,
  NumberInput as ChakraNumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  NumberInputProps as ChakraNumberInputProps,
} from "@vastly/ui";
import { __DEV__ } from "../utils";
// TODO: Remove the workaround whenever MS fixes the issue
// https://github.com/microsoft/TypeScript/issues/48212
import type { ComponentWithAs } from "@vastly/ui";

interface NumberInputOptions {
  /**
   * Hide the stepper.
   */
  hideStepper?: boolean;
  /**
   * Render a custom increment icon.
   */
  incrementIcon?: React.ReactNode;
  /**
   * Render a custom decrement icon.
   */
  decrementIcon?: React.ReactNode;
}

export interface NumberInputProps extends ChakraNumberInputProps, NumberInputOptions {}

export const NumberInput = forwardRef<NumberInputProps, "div">((props, ref) => {
  const { hideStepper, incrementIcon, decrementIcon, ...rest } = props;

  return (
    <ChakraNumberInput {...rest} ref={ref}>
      <NumberInputField />

      {!hideStepper && (
        <NumberInputStepper>
          <NumberIncrementStepper>{incrementIcon}</NumberIncrementStepper>
          <NumberDecrementStepper>{decrementIcon}</NumberDecrementStepper>
        </NumberInputStepper>
      )}
    </ChakraNumberInput>
  );
});

NumberInput.defaultProps = {
  hideStepper: false,
};

if (__DEV__) {
  NumberInput.displayName = "NumberInput";
}
