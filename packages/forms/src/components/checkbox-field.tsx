import React from "react"

import {
  forwardRef,
  Checkbox,
  FormControl,
  FormHelperText,
  CheckboxProps,
  HTMLChakraProps,
  ThemingProps,
} from "@chakra-ui/react"
import { TranslationErrorMessage } from "./translation-error-message"

export interface CheckboxFieldProps extends CheckboxProps {
  /** Register prop from react-hook-form */
  register: any
  /** Field name */
  name: string
  /** Errors object from react-hook-form formState */
  errors?: any
  /** Field helper text */
  helperText?: string
  /** Used to style the form control, which contains the entire component */
  formControlStyles?: HTMLChakraProps<"div"> & ThemingProps<"FormControl">
}

export const CheckboxField = forwardRef<CheckboxFieldProps, "input">((props, ref) => {
  const { register, name, helperText, children, formControlStyles, errors, ...rest } = props

  return (
    <FormControl id={name} isInvalid={errors && !!errors?.[name]} ref={ref} sx={formControlStyles}>
      <Checkbox {...register(name)} {...rest}>
        {children}
      </Checkbox>
      {helperText && !errors?.[name] && <FormHelperText>{helperText ?? ""}</FormHelperText>}
      {errors && (
        <TranslationErrorMessage errors={errors} name={name}>
          {errors && errors?.[name] && errors?.[name]?.message}
        </TranslationErrorMessage>
      )}
    </FormControl>
  )
})
