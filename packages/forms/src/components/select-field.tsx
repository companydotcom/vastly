import React from "react"
import {
  FormControl,
  FormLabel,
  SelectFieldProps as PSelectFieldProps,
  FormHelperText,
  Select,
  HTMLChakraProps,
  ThemingProps,
  Skeleton,
} from "@chakra-ui/react"
import { get } from "lodash"
import { FieldErrors, UseFormRegister } from "react-hook-form"
import { TranslationErrorMessage } from "./translation-error-message"

export interface _SelectFieldProps extends PSelectFieldProps {
  /** Register prop from react-hook-form */
  register: UseFormRegister<any>
  /** Field name */
  name: string
  /** Errors object from react-hook-form formState */
  errors?: FieldErrors<any>
  /** Field label */
  label?: string
  /** Used to style the form control, which contains the entire component */
  formControlStyles?: HTMLChakraProps<"div"> & ThemingProps<"FormControl">
  /** Field helper text */
  helperText?: string
  /** Current loading state for the input field */
  isLoading?: boolean
}

export const PotionSelectField: React.FC<_SelectFieldProps> = (props) => {
  const {
    children,
    errors,
    register,
    name,
    label,
    formControlStyles,
    helperText,
    isLoading,
    ...rest
  } = props

  return (
    <FormControl id={name} isInvalid={errors && !!get(errors, name)} sx={formControlStyles}>
      <FormLabel htmlFor={name}>{label ?? ""}</FormLabel>
      <Skeleton isLoaded={!isLoading}>
        <Select {...register(name)} data-test={`select-${name}`} {...rest}>
          {children}
        </Select>
      </Skeleton>
      {helperText && !get(errors, name) && <FormHelperText>{helperText ?? ""}</FormHelperText>}
      {errors && (
        <TranslationErrorMessage errors={errors} name={name}>
          {errors && get(errors, name) && get(errors, name)?.message}
        </TranslationErrorMessage>
      )}
    </FormControl>
  )
}
