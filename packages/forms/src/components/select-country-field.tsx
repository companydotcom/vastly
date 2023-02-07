import React from "react"
import { CountryDropdown, CountryDropdownProps } from "react-country-region-selector"
import { Controller, Control } from "react-hook-form"
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  HTMLChakraProps,
  ThemingProps,
  useMultiStyleConfig,
  FormHelperText,
  SelectIcon,
  chakra,
  Skeleton,
} from "@chakra-ui/react"
import { useTranslation } from "react-i18next"

export interface SelectCountryProps
  extends Omit<CountryDropdownProps, "onChange" | "onBlur" | "value"> {
  /** Whether you want to show a default option.
   */
  showDefaultOption?: boolean
  /**
   * The default option label.
   *
   * @default ""
   */
  defaultOptionLabel?: string
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
  /** Current loading state for the input field */
  isLoading?: boolean
}

export const SelectCountryField: React.FC<SelectCountryProps> = (props) => {
  const {
    control,
    name,
    label,
    helperText,
    formControlStyles,
    defaultOptionLabel,
    showDefaultOption,
    isLoading,
    ...rest
  } = props
  const { t } = useTranslation()
  const styles = useMultiStyleConfig("Select", props)

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, onBlur, value, name, ref },
        fieldState: { invalid, error },
      }) => {
        // @ts-ignore
        const errorStyles = error || invalid ? styles?.field?._invalid : {}

        return (
          <FormControl
            isInvalid={invalid}
            id={name}
            sx={{
              ...formControlStyles,
              ".select-country": { ...errorStyles },
              select: { ...styles.field },
            }}
          >
            <FormLabel htmlFor={name}>{label ?? ""}</FormLabel>
            <Skeleton isLoaded={!isLoading}>
              <chakra.div className="potion-select__wrapper" __css={{ position: "relative" }}>
                <CountryDropdown
                  name={name}
                  ref={ref}
                  {...rest}
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  defaultOptionLabel={defaultOptionLabel}
                  classes="select-country"
                />

                <SelectIcon __css={{ ...styles.icon }} />
              </chakra.div>
            </Skeleton>

            {helperText && !error && <FormHelperText>{helperText ?? ""}</FormHelperText>}
            {/* @ts-ignore */}
            {error && <FormErrorMessage>{t(error?.message)}</FormErrorMessage>}
          </FormControl>
        )
      }}
    />
  )
}
