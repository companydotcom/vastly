import React from "react"
import {
  FormControl,
  FormLabel,
  FormHelperText,
  HTMLChakraProps,
  ThemingProps,
} from "@chakra-ui/react"
import { Controller, Control, FieldErrors } from "react-hook-form"
import { TranslationErrorMessage } from "./translation-error-message"
import { Props, RSelect } from "../potion-react-select"

export interface ReactSelectFieldProps extends Props {
  /** Control object from react-hook-form */
  control: Control<any>
  /** Field name */
  name: string
  /** Field label */
  label?: string
  /** Field helper text */
  helperText?: string
  /** Used to style the form control, which contains the entire component */
  formControlStyles?: HTMLChakraProps<"div"> & ThemingProps<"FormControl">
  /** Errors object from react-hook-form formState */
  errors?: FieldErrors<any>
}

export const ReactSelectField: React.FC<ReactSelectFieldProps> = (props) => {
  const {
    name,
    label,
    helperText,
    control,
    onChange: customOnChange,
    formControlStyles,
    errors,
    ...rest
  } = props
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value, name }, fieldState: { invalid, error } }) => (
        <FormControl isInvalid={invalid} id={name} sx={formControlStyles}>
          <FormLabel htmlFor={name}>{label ?? ""}</FormLabel>
          {/* @ts-ignore */}
          <RSelect
            name={name}
            onChange={customOnChange || onChange}
            onBlur={onBlur}
            value={value}
            {...rest}
          />
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
