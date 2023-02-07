import React from "react"
import {
  FormControl,
  FormLabel,
  FormHelperText,
  HTMLChakraProps,
  ThemingProps,
  TextareaProps,
  Textarea,
  Skeleton,
} from "@chakra-ui/react"
import { get } from "lodash"
import { FieldErrors, UseFormRegister, Control } from "react-hook-form"
import { TranslationErrorMessage } from "./translation-error-message"

export interface TextareaFieldProps extends TextareaProps {
  /** Register prop from react-hook-form */
  register: UseFormRegister<any>
  /** Field name */
  name: string
  /** Errors object from react-hook-form formState */
  errors?: FieldErrors<any>
  /** Field label */
  label?: string
  /** Field helper text */
  helperText?: string
  /** Control object from react-hook-form */
  control?: Control<any>
  /** Used to style the form control, which contains the entire component */
  formControlStyles?: HTMLChakraProps<"div"> & ThemingProps<"FormControl">
  /** Current loading state for the input field */
  isLoading?: boolean
}

export const TextareaField: React.FC<TextareaFieldProps> = (props) => {
  const {
    errors,
    register,
    name,
    label,
    helperText,
    control,
    isLoading,
    formControlStyles,
    ...rest
  } = props

  return (
    <FormControl id={name} isInvalid={errors && !!get(errors, name)} sx={formControlStyles}>
      <FormLabel htmlFor={name}>{label ?? ""}</FormLabel>
      <Skeleton isLoaded={!isLoading}>
        <Textarea {...register(name)} data-test={`textarea-${name}`} {...rest} />
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
