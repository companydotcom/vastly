import React from "react"
import { RegionDropdown } from "react-country-region-selector"
import { Controller, Control } from "react-hook-form"
import {
  FormControl,
  FormLabel,
  HTMLChakraProps,
  ThemingProps,
  useMultiStyleConfig,
  FormHelperText,
  SelectIcon,
  chakra,
  Skeleton,
  FormErrorMessage,
} from "@chakra-ui/react"
import { useTranslation } from "react-i18next"

export interface SelectRegionProps {
  /** Control object from react-hook-form */
  control: Control<any>
  /** Field name */
  name: string
  /** Selected Country */
  country: string
  /** Field label */
  label?: string
  /** Field helper text */
  helperText?: string
  /** Used to style the form control, which contains the entire component */
  formControlStyles?: HTMLChakraProps<"div"> & ThemingProps<"FormControl">
  /** Current loading state for the input field */
  isLoading?: boolean
}

export const SelectRegionField: React.FC<SelectRegionProps> = (props) => {
  const { country, control, name, label, helperText, formControlStyles, isLoading, ...rest } = props
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
              ".select-region": { ...errorStyles },
              select: { ...styles.field },
            }}
          >
            <FormLabel htmlFor={name}>{label ?? ""}</FormLabel>

            <Skeleton isLoaded={!isLoading}>
              <chakra.div
                className="chakra-select__wrapper"
                __css={{
                  position: "relative",
                }}
              >
                <RegionDropdown
                  country={country}
                  name={name}
                  ref={ref}
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  blankOptionLabel=""
                  defaultOptionLabel=""
                  classes="select-region"
                  valueType="short"
                  {...rest}
                />

                <SelectIcon
                  {...rest}
                  __css={{
                    ...styles.icon,
                  }}
                />
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
