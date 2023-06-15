import * as React from "react";
import { useFormContext } from "react-hook-form";
import { Button, ButtonProps, forwardRef } from "@vastly/ui";

// TODO: Remove the workaround whenever MS fixes the issue
// https://github.com/microsoft/TypeScript/issues/48212
import type { ComponentWithAs } from "@vastly/ui";

export interface SubmitButtonProps extends ButtonProps {
  /**
   * Disable the submit button if the form is untouched.
   */
  disableIfUntouched?: boolean;
  /**
   * Disable the submit button if the form is invalid.
   */
  disableIfInvalid?: boolean;
}

export const SubmitButton = forwardRef<SubmitButtonProps, "button">((props, ref) => {
  const {
    children = "Submit",
    disableIfUntouched,
    disableIfInvalid,
    isDisabled: isDisabledProp,
    isLoading,
    ...rest
  } = props;
  const { formState } = useFormContext();

  const isDisabled =
    (disableIfUntouched && !formState.isDirty) ||
    (disableIfInvalid && !formState.isValid) ||
    isDisabledProp;

  return (
    <Button
      {...rest}
      ref={ref}
      type="submit"
      isLoading={formState.isSubmitting || isLoading}
      isDisabled={isDisabled}
    >
      {children}
    </Button>
  );
});

SubmitButton.defaultProps = {
  disableIfUntouched: false,
  disableIfInvalid: false,
};

SubmitButton.displayName = "SubmitButton";
