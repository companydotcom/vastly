import React, { useState, useCallback } from "react"
import { Controller, Control, FieldErrors } from "react-hook-form"
import PhoneInput, { PhoneInputProps } from "react-phone-input-2"
import { CountryCode } from "libphonenumber-js"
import {
  FormControl,
  FormLabel,
  FormHelperText,
  HTMLChakraProps,
  ThemingProps,
  useMultiStyleConfig,
  Box,
  SystemStyleObject,
  Skeleton,
} from "@chakra-ui/react"
// need this for flags
import "react-phone-input-2/lib/style.css"

// localization files for phone dropdown
import es from "react-phone-input-2/lang/es.json"
// import de from 'react-phone-input-2/lang/de.json';
// import ru from 'react-phone-input-2/lang/ru.json';
// import fr from 'react-phone-input-2/lang/fr.json';
// import jp from 'react-phone-input-2/lang/jp.json';
// import cn from 'react-phone-input-2/lang/cn.json';
// import pt from 'react-phone-input-2/lang/pt.json';
// import it from 'react-phone-input-2/lang/it.json';
// import ir from 'react-phone-input-2/lang/ir.json';
// import ar from 'react-phone-input-2/lang/ar.json';
// import tr from 'react-phone-input-2/lang/tr.json';
// import id from 'react-phone-input-2/lang/id.json';
import { TranslationErrorMessage } from "./translation-error-message"

const localizationMap = {
  "es-mx": es,
}

export interface PhoneInputFieldProps extends PhoneInputProps {
  /** Register prop from react-hook-form */
  control: Control<any>
  /** Field name */
  name: string
  /** Accepts a handler to grab the country from react-phone-input-2 */
  countryCodeHandler?: (country: PhoneInputCountry) => void
  /** Field helper text */
  helperText?: string
  /** Field label */
  label?: string
  /** Placeholder inside each field */
  placeholder?: string
  /** Used to style the form control, which contains the entire component */
  formControlStyles?: HTMLChakraProps<"div"> & ThemingProps<"FormControl">
  /** error state handler */
  setError?: React.Dispatch<React.SetStateAction<boolean>>
  /** Language code for setting field translations and default flags */
  languageCode?: string
  /** Whether the field is disabled or not */
  isDisabled?: boolean
  className?: string
  /** Errors object from react-hook-form formState */
  errors?: FieldErrors<any>
  isLoading?: boolean
}

export const PhoneInputField: React.FC<PhoneInputFieldProps> = (props) => {
  const {
    name,
    languageCode,
    setError,
    control,
    helperText,
    label,
    formControlStyles,
    isDisabled,
    className,
    errors,
    countryCodeHandler,
    isLoading,
    ...rest
  } = props

  const styles = useMultiStyleConfig("Input", props)

  const customStyles = {
    width: "100%",
    ".react-tel-input": {
      ".potion-phone-input__input": {
        ...styles.field,
        paddingStart: styles.field.height ?? styles.field.h,
      },
      ".form-control.invalid-number:focus": {
        // @ts-ignore
        ...styles.field?.["_invalid"],
      },
      ".potion-phone-input__button": {
        position: "absolute",
        top: 0,
        zIndex: 2,
        width: styles.field?.height ?? styles.field?.h,
        height: styles.field?.height ?? styles.field?.h,
        fontSize: styles.field?.fontSize,
        insetStart: "0",
        backgroundColor: "inherit",
        border: "none",
        ".selected-flag": {
          backgroundColor: "inherit",
          borderRadius: ".375rem 0 0 .375rem",
        },
        ".selected-flag:hover": {
          background: "gray.100",
        },
        ".selected-flag:focus": {
          background: "gray.200",
        },
      },
    },
  } as SystemStyleObject

  return (
    <Box sx={customStyles}>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <FormControl id={name} isInvalid={fieldState?.invalid} sx={formControlStyles}>
            <FormLabel htmlFor={name}>{label ?? ""}</FormLabel>
            <Skeleton isLoaded={!isLoading}>
              <PhoneInput
                {...field}
                inputProps={{
                  name,
                  required: fieldState?.invalid,
                  disabled: isDisabled,
                }}
                onChange={(value, country: PhoneInputCountry) => {
                  field.onChange(value)
                  countryCodeHandler?.(country)
                }}
                isValid={!fieldState?.invalid}
                country={languageCode?.toLowerCase() ?? "us"}
                // @ts-ignore
                localization={localizationMap[languageCode?.toLowerCase() ?? "us"] ?? "us"}
                inputClass={`potion-phone-input__input ${className}`}
                buttonClass="potion-phone-input__button"
                dropdownStyle={{
                  textAlign: "left",
                }}
                countryCodeEditable={false}
                enableSearch
                {...rest}
              />
            </Skeleton>

            {helperText && !errors?.[name] && <FormHelperText>{helperText ?? ""}</FormHelperText>}
            {errors && (
              <TranslationErrorMessage errors={errors} name={name}>
                {errors && errors?.[name] && errors?.[name]?.message}
              </TranslationErrorMessage>
            )}
          </FormControl>
        )}
      />
    </Box>
  )
}

interface PhoneInputCountry {
  countryCode?: CountryCode
  dialCode?: string
  name?: string
}

export function usePhoneInputField() {
  const [country, setCountry] = useState<PhoneInputCountry>()

  const phoneHandleChange = useCallback((country: PhoneInputCountry) => {
    setCountry(country)
  }, [])

  return {
    countryName: country?.name,
    countryCode: country?.countryCode?.toUpperCase() as CountryCode,
    dialCode: country?.dialCode,
    phoneHandleChange,
  }
}

export type UsePhoneInputFieldReturn = ReturnType<typeof usePhoneInputField>
