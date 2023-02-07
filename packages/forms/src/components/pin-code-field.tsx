import React from "react"
import {
  FormControl,
  FormHelperText,
  __DEV__,
  PinInputProps,
  PinInput,
  PinInputField,
  HTMLPotionProps,
  ThemingProps,
  FormLabel,
  HStack,
} from "@companydotcom/potion"
import { Controller, Control, FieldErrors } from "react-hook-form"
import { TranslationErrorMessage } from "./translation-error-message"

export interface PinCodeFieldProps extends Omit<PinInputProps, "children"> {
  /** Number of fields to render */
  length: number
  /** Register prop from react-hook-form */
  control: Control<any>
  /** Field name */
  name: string
  /** Field helper text */
  helperText?: string
  /** Field label */
  label?: string
  /** Placeholder inside each field */
  placholder?: string
  /** Used to style the form control, which contains the entire component */
  formControlStyles?: HTMLPotionProps<"div"> & ThemingProps<"FormControl">
  /** Errors object from react-hook-form formState */
  errors?: FieldErrors<any>
}

export const PinCodeField: React.FC<PinCodeFieldProps> = (props) => {
  const {
    name,
    length,
    control,
    helperText,
    label,
    formControlStyles,
    placeholder = "",
    errors,
    ...rest
  } = props

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value, name, ref }, fieldState: { invalid, error } }) => (
        <FormControl id={name} isInvalid={invalid} ref={ref} sx={formControlStyles}>
          <FormLabel>{label ?? ""}</FormLabel>
          <HStack>
            <PinInput value={value} onChange={onChange} placeholder={placeholder} {...rest}>
              {[...Array(length).keys()].map((_, i) => (
                <PinInputField key={i} />
              ))}
            </PinInput>
          </HStack>
          {helperText && !error && <FormHelperText>{helperText ?? ""}</FormHelperText>}
          {errors && (
            <TranslationErrorMessage errors={errors} name={name}>
              {errors && errors?.[name] && errors?.[name]?.message}
            </TranslationErrorMessage>
          )}
        </FormControl>
      )}
    />
  )
}

if (__DEV__) {
  PinCodeField.displayName = "PinCodeField"
}
