import {
  useFormContext,
  FormState,
  Controller,
  get,
  RegisterOptions,
  FieldValues,
  FieldPath,
} from "react-hook-form"

import {
  forwardRef,
  Box,
  FormControl,
  FormControlProps,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Input,
  Textarea,
  Checkbox,
  Switch,
  useMergeRefs,
  InputGroup,
  InputProps,
  TextareaProps,
  SwitchProps,
  CheckboxProps,
  PinInputField,
  HStack,
  PinInput,
  UsePinInputProps,
  SystemProps,
} from "@chakra-ui/react"
import { __DEV__, FocusableElement, callAllHandlers } from "@chakra-ui/utils"

export interface Option {
  value: string
  label?: string
  [key: string]: unknown
}

export type FieldRules = Pick<
  RegisterOptions,
  "required" | "min" | "max" | "maxLength" | "minLength" | "pattern"
>

export interface FieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<FormControlProps, "label" | "type"> {
  /**
   * The field name
   */
  name: TName
  /**
   * The field label
   */
  label?: string
  /**
   * Hide the field label
   */
  hideLabel?: boolean
  /**
   * Field help text
   */
  helperText?: string
  /**
   * React hook form rules
   */
  rules?: Omit<
    RegisterOptions<TFieldValues, TName>,
    "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
  >
  /**
   * Build-in types:
   * - text
   * - number
   * - password
   * - textarea
   * - select
   * - native-select
   * - checkbox
   * - radio
   * - switch
   * - pin
   *
   * Will default to a text field if there is no matching type.
   */
  type?: string
  /**
   * The input placeholder
   */
  placeholder?: string
}

const getError = (name: string, formState: FormState<{ [x: string]: any }>) => {
  return get(formState.errors, name)
}

export const BaseField = (props: FieldProps) => {
  const { name, label, helperText, hideLabel, children, ...controlProps } = props

  const { formState } = useFormContext()

  const error = getError(name, formState)

  return (
    <FormControl {...controlProps} isInvalid={!!error}>
      {label && !hideLabel ? <FormLabel htmlFor={name}>{label}</FormLabel> : null}
      <Box>
        {children}
        {helperText && !error?.message ? <FormHelperText>{helperText}</FormHelperText> : null}
        {error?.message && <FormErrorMessage>{error?.message}</FormErrorMessage>}
      </Box>
    </FormControl>
  )
}
