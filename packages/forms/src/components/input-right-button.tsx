import * as React from "react";

import { Button, ButtonProps, forwardRef, InputRightElement } from "@chakra-ui/react";
import { __DEV__ } from "../utils";
// TODO: Remove the workaround whenever MS fixes the issue
// https://github.com/microsoft/TypeScript/issues/48212
import type { ComponentWithAs } from "@chakra-ui/react";

export type InputRightButtonProps = ButtonProps;

export const InputRightButton = forwardRef<InputRightButtonProps, "div">((props, ref) => {
  return (
    <InputRightElement w="auto" px="1" py="1" alignItems="stretch">
      <Button ref={ref} height="auto" {...props} />
    </InputRightElement>
  );
});

InputRightButton.id = "InputRightElement";

InputRightButton.displayName = "InputRightButton";
