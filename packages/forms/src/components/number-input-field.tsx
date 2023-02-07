import React from "react"
import {
  NumberInput,
  FormControl,
  FormLabel,
  NumberInputFieldProps as PNumberInputFieldProps,
  NumberInputField as CNumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  HTMLChakraProps,
  ThemingProps,
  FormHelperText,
} from "@chakra-ui/react"
import { get } from "lodash"
import { FieldErrors, Control, Controller } from "react-hook-form"
import { TranslationErrorMessage } from "./translation-error-message"

export interface NumberInputFieldProps extends PNumberInputFieldProps {
  /** Field name */
  name: string
  /** control prop from react-hook-form */
  control: Control<any>
  /** Errors object from react-hook-form formState */
  errors?: FieldErrors<any>
  /** Field label */
  label?: string
  /** Max number of input allowed */
  max?: number
  /** Min number of input allowed */
  min?: number
  /** Field helper text */
  helperText?: string
  /** Used to style the form control, which contains the entire component */
  formControlStyles?: HTMLChakraProps<"div"> & ThemingProps<"FormControl">
  /** Hide the stepper component */
  hideNumberStepper?: boolean
  /** Used to style the Number Input wrapper, which contains the entire Number Input component */
  inputStyles?: HTMLChakraProps<"div"> & ThemingProps<"NumberInput">
  /** Hide the stepper component */
  precision?: number
  /** Number of decimal places to be rounded to */
}

export const NumberInputField: React.FC<NumberInputFieldProps> = (props) => {
  const {
    errors,
    hideNumberStepper,
    helperText,
    name,
    label,
    max,
    min,
    formControlStyles,
    inputStyles,
    control,
    precision,
    ...rest
  } = props

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { ref, ...restField } }) => (
        <FormControl id={name} isInvalid={errors && !!get(errors, name)} sx={formControlStyles}>
          <FormLabel htmlFor={name}>{label ?? ""}</FormLabel>
          <NumberInput {...restField} sx={inputStyles} precision={precision}>
            <CNumberInputField
              ref={ref}
              name={restField.name}
              data-test={`numberinput-${name}`}
              max={max}
              min={min}
              {...rest}
            />
            {!hideNumberStepper && (
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            )}
          </NumberInput>
          {helperText && !get(errors, name) && <FormHelperText>{helperText ?? ""}</FormHelperText>}

          {errors && (
            <TranslationErrorMessage errors={errors} name={name}>
              {errors && get(errors, name) && get(errors, name)?.message}
            </TranslationErrorMessage>
          )}
        </FormControl>
      )}
    />
  )
}
