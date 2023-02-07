import React from "react"
import { Controller, Control, FieldErrors } from "react-hook-form"
import {
  FormControl,
  FormLabel,
  HTMLChakraProps,
  ThemingProps,
  FormHelperText,
} from "@chakra-ui/react"
import { TranslationErrorMessage } from "./translation-error-message"
import { AsyncSelect, Props } from "./potion-react-select"

export interface ReactSelectFieldAsyncProps extends Props {
  /** Field name */
  name: string
  /** Field label */
  label?: string
  /** Field helper text */
  helperText?: string
  /** Control object from react-hook-form */
  control?: Control<any>
  /** Used to style the form control, which contains the entire component */
  formControlStyles?: HTMLChakraProps<"div"> & ThemingProps<"FormControl">
  /** Errors object from react-hook-form formState */
  errors?: FieldErrors<any>
  /** TODO: Need  to type this properly */
  loadOptions?: any
}

export const ReactSelectFieldAsync: React.FC<ReactSelectFieldAsyncProps> = (props) => {
  const { control, name, label, helperText, formControlStyles, errors, ...rest } = props

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, onBlur, value, name, ref },
        fieldState: { invalid, error },
      }) => (
        <FormControl isInvalid={invalid} id={name} sx={formControlStyles}>
          <FormLabel htmlFor={name}>{label ?? ""}</FormLabel>
          {/* @ts-ignore */}
          <AsyncSelect
            name={name}
            ref={ref}
            onChange={onChange}
            // @ts-ignore
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
