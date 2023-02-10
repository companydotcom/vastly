/* eslint-disable react/no-children-prop */
import { memo, useRef, useState } from "react"
import {
  Box,
  chakra,
  Divider,
  Flex,
  forwardRef,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  InputProps as ChakraInputProps,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  Image,
} from "@chakra-ui/react"
// import PhoneInputWithCountry from "react-phone-number-input/react-hook-form"
import PhoneInputWithCountry, {
  type Country,
  getCountryCallingCode,
  parsePhoneNumber,
} from "react-phone-number-input"

// TODO: Remove the workaround whenever MS fixes the issue
// https://github.com/microsoft/TypeScript/issues/48212
import type { ComponentWithAs } from "@chakra-ui/react"

export interface ReactPhoneInputProps
  extends Omit<ChakraInputProps, "defaultValue" | "name" | "value"> {
  country?: Country
  defaultCountry?: Country
  onCountryChange?: (country?: Country) => void
  placeholder?: string
  withCountryCallingCode?: boolean
  addInternationalOption?: boolean
  international?: boolean
}

export const ReactPhoneInput = forwardRef<ReactPhoneInputProps, "div">((props, ref) => {
  const {
    defaultCountry,
    international,
    withCountryCallingCode,
    country,
    onCountryChange,
    addInternationalOption,
    ...rest
  } = props
  return (
    <InputGroup>
      <PhoneInputWithCountry
        ref={ref}
        defaultCountry={defaultCountry ?? "US"}
        countrySelectComponent={CountrySelect}
        inputComponent={Input}
        international={international ?? true}
        withCountryCallingCode={withCountryCallingCode ?? true}
        country={country ?? "US"}
        onCountryChange={onCountryChange}
        flagComponent={FlagIcon}
        countryCallingCodeEditable={false}
        addInternationalOption={addInternationalOption ?? false}
        style={{ width: "100%" }}
        pl="4rem"
        {...rest}
      />
    </InputGroup>
  )
})

//           control={control}
//           defaultValue={defaultValue}
//           defaultCountry={defaultCountry ?? 'US'}
//           country={country ?? 'US'}
//           international={international ?? true}
//           withCountryCallingCode={withCountryCallingCode ?? true}
//           inputComponent={Input}
//           countrySelectComponent={CountrySelect}
//           onCountryChange={onCountryChange}
//           flagComponent={FlagIcon}
//           countryCallingCodeEditable={false}
//           placeholder={placeholder || `+${getCountryCallingCode(country ?? 'US')}` || ''}
//           addInternationalOption={addInternationalOption ?? false}
//           style={{ width: '100%' }}
//           pl="4rem"
//           {...rest}

interface CountryItem {
  value?: Country
  label?: string
}

interface CountrySelectProps {
  name?: string
  value?: string
  onChange?: (value?: string) => void
  options: CountryItem[]
  iconComponent: React.ElementType
  disabled?: boolean
  readOnly?: boolean
  tabIndex?: number | string
  className?: string
}

const CountrySelect = ({ options, value, onChange, iconComponent: Flag }: CountrySelectProps) => {
  const [filteredList, setFilteredList] = useState(options)

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const evalue = event.target.value.toLowerCase()
    const result =
      options?.filter((item) => {
        return item?.label?.toLowerCase().includes(evalue)
      }) || []
    setFilteredList(result)
  }
  const initialFocusRef = useRef(null)

  return (
    <Popover initialFocusRef={initialFocusRef} placement="bottom-start">
      {({ isOpen }) => (
        <>
          <InputLeftElement
            height="full"
            children={
              <PopoverTrigger>
                <chakra.button type="button" pl="4" h="full">
                  <HStack spacing={1}>
                    <Flag label={value} country={value} />
                    {/* <FontAwesomeIcon icon={isOpen ? faAngleUp : faAngleDown} /> */}
                  </HStack>
                </chakra.button>
              </PopoverTrigger>
            }
          />
          <PopoverContent>
            <PopoverBody p="0">
              <Box py="2" px="4">
                <InputGroup size="sm">
                  <InputLeftElement
                    pointerEvents="none"
                    // children={<FontAwesomeIcon icon={faSearch} />}
                  />
                  <Input
                    ref={initialFocusRef}
                    type="text"
                    size="sm"
                    name="search-input"
                    autoComplete="new-password"
                    pl="2rem"
                    onChange={(event) => handleSearch(event)}
                  />
                </InputGroup>
              </Box>

              <Divider />
              <Flex
                flexDir="column"
                align="flex-start"
                textAlign="left"
                justify="flex-start"
                pt="2"
                pb="3"
                maxH="xs"
                width="full"
                height="auto"
                overflowY="scroll"
              >
                {filteredList?.map((x, i) => (
                  <MenuItemWithFlag key={i} onChange={onChange} iconComponent={Flag} {...x} />
                ))}
              </Flex>
            </PopoverBody>
          </PopoverContent>
        </>
      )}
    </Popover>
  )
}

interface MenuItemWithFlag extends Pick<CountrySelectProps, "iconComponent"> {
  onChange?: (value?: string) => void
  value?: Country
  label?: string
}

const MenuItemWithFlag = memo(
  ({ onChange, iconComponent: Flag, value, label }: MenuItemWithFlag) => {
    return (
      <chakra.button
        w="full"
        _hover={{ bg: "gray.100" }}
        type="button"
        onClick={() => onChange?.(value)}
      >
        <HStack py="2" px="4">
          <Flag label={label} country={value} />
          <Text textStyle="sm">
            {label}
            {value && (
              <chakra.span color="blackAlpha.500">{` +${getCountryCallingCode(
                value,
              )}`}</chakra.span>
            )}
          </Text>
        </HStack>
      </chakra.button>
    )
  },
)

MenuItemWithFlag.displayName = "MenuItemWithFlag"

interface EmbeddedFlagProps {
  title: string
}

type EmbeddedFlag = (props: EmbeddedFlagProps) => JSX.Element

export type Flags = Partial<Record<Country, EmbeddedFlag>>

interface FlagProps {
  country: Country
  countryName: string
  flagUrl?: string
  flags?: Flags
}

const FlagIcon = ({ country, flagUrl, countryName }: FlagProps) => {
  return (
    <Image
      alt={countryName || ""}
      //   label={countryName}
      src={flagUrl?.replace("{XX}", country)}
      boxSize="5"
    />
  )
}

// import { memo, useRef, useState, useCallback } from 'react';
// import {
//   Text,
//   Input,
//   InputGroup,
//   HStack,
//   Image,
//   InputLeftElement,
//   Box,
//   FormControl,
//   HTMLChakraProps,
//   ThemingProps,
//   FormHelperText,
//   FormLabel,
//   chakra,
//   Popover,
//   PopoverTrigger,
//   PopoverContent,
//   PopoverBody,
//   Divider,
//   Flex,
//   InputProps,
// } from '@chakra-ui/react';
// import PhoneInputWithCountry from 'react-phone-number-input/react-hook-form';
// import { Country } from 'react-phone-number-input/core';
// import { faAngleDown, faAngleUp } from '@fortawesome/pro-solid-svg-icons';
// import { faSearch } from '@fortawesome/pro-regular-svg-icons';
// import { CountryCode, getCountryCallingCode, parsePhoneNumber } from 'libphonenumber-js';
// import { ControllerProps, FieldErrors, Control } from 'react-hook-form';

// export type DefaultFormValues = Record<string, any>;

// export interface PhoneNumberInputProps<FormValues extends DefaultFormValues>
//   extends Omit<InputProps, 'defaultValue' | 'name'>,
//     Pick<ControllerProps, 'defaultValue' | 'name'> {
//   control: Control<DefaultFormValues, any>;
//   country?: CountryCode;
//   defaultCountry?: CountryCode;
//   size?: 'xs' | 'sm' | 'md' | 'lg';
//   errors?: FieldErrors<FormValues>;
//   formControlStyles?: HTMLPotionProps<'div'> & ThemingProps<'FormControl'>;
//   label?: string;
//   helperText?: string;
//   onCountryChange?: (country?: CountryCode) => void;
//   placeholder?: string;
//   withCountryCallingCode?: boolean;
//   addInternationalOption?: boolean;
//   international?: boolean;
// }

// //Example Netherlands phone number +3197010299999

// export const PhoneNumberInputField = <DefaultFormValues extends {}>({
//   name,
//   control,
//   size,
//   errors,
//   formControlStyles,
//   helperText,
//   label,
//   onCountryChange,
//   defaultCountry,
//   country,
//   defaultValue,
//   placeholder,
//   withCountryCallingCode,
//   addInternationalOption,
//   international,
//   ...rest
// }: PhoneNumberInputProps<DefaultFormValues>) => {
//   return (
//     <FormControl id={name} isInvalid={errors && !!errors?.[name]} sx={formControlStyles}>
//       <FormLabel htmlFor={name}>{label ?? ''}</FormLabel>
//       <InputGroup size={size ?? 'md'}>
//         <PhoneInputWithCountry
//           name={name}
//           control={control}
//           defaultValue={defaultValue}
//           defaultCountry={defaultCountry ?? 'US'}
//           country={country ?? 'US'}
//           international={international ?? true}
//           withCountryCallingCode={withCountryCallingCode ?? true}
//           inputComponent={Input}
//           countrySelectComponent={CountrySelect}
//           onCountryChange={onCountryChange}
//           flagComponent={FlagIcon}
//           countryCallingCodeEditable={false}
//           placeholder={placeholder || `+${getCountryCallingCode(country ?? 'US')}` || ''}
//           addInternationalOption={addInternationalOption ?? false}
//           style={{ width: '100%' }}
//           pl="4rem"
//           {...rest}
//         />
//       </InputGroup>
//       {helperText && !errors?.[name] && <FormHelperText>{helperText ?? ''}</FormHelperText>}
//       {errors && (
//         <TranslationErrorMessage errors={errors} name={name}>
//           {errors && errors?.[name] && errors?.[name]?.message}
//         </TranslationErrorMessage>
//       )}
//     </FormControl>
//   );
// };

// interface CountryItem {
//   value?: CountryCode;
//   label?: string;
// }

// interface CountrySelectProps {
//   name?: string;
//   value?: string;
//   onChange?: (value?: string) => void;
//   options: CountryItem[];
//   iconComponent: React.ElementType;
//   disabled?: boolean;
//   readOnly?: boolean;
//   tabIndex?: number | string;
//   className?: string;
// }

// const CountrySelect = ({ options, value, onChange, iconComponent: Flag }: CountrySelectProps) => {
//   const [filteredList, setFilteredList] = useState(options);

//   const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const evalue = event.target.value.toLowerCase();
//     const result =
//       options?.filter(item => {
//         return item?.label?.toLowerCase().includes(evalue);
//       }) || [];
//     setFilteredList(result);
//   };

//   const initialFocusRef = useRef(null);

//   return (
//     <Popover initialFocusRef={initialFocusRef} placement="bottom-start">
//       {({ isOpen }) => (
//         <>
//           <InputLeftElement
//             height="full"
//             children={
//               <PopoverTrigger>
//                 <potion.button type="button" pl="4" h="full">
//                   <HStack spacing={1}>
//                     <Flag label={value} country={value} />
//                     <FontAwesomeIcon icon={isOpen ? faAngleUp : faAngleDown} />
//                   </HStack>
//                 </potion.button>
//               </PopoverTrigger>
//             }
//           />
//           <PopoverContent>
//             <PopoverBody p="0">
//               <Box py="2" px="4">
//                 <InputGroup size="sm">
//                   <InputLeftElement
//                     pointerEvents="none"
//                     children={<FontAwesomeIcon icon={faSearch} />}
//                   />
//                   <Input
//                     ref={initialFocusRef}
//                     type="text"
//                     size="sm"
//                     name="search-input"
//                     autoComplete="new-password"
//                     pl="2rem"
//                     onChange={event => handleSearch(event)}
//                   />
//                 </InputGroup>
//               </Box>

//               <Divider />
//               <Flex
//                 flexDir="column"
//                 align="flex-start"
//                 textAlign="left"
//                 justify="flex-start"
//                 pt="2"
//                 pb="3"
//                 maxH="xs"
//                 width="full"
//                 height="auto"
//                 overflowY="scroll"
//               >
//                 {filteredList?.map((x, i) => (
//                   <MenuItemWithFlag key={i} onChange={onChange} iconComponent={Flag} {...x} />
//                 ))}
//               </Flex>
//             </PopoverBody>
//           </PopoverContent>
//         </>
//       )}
//     </Popover>
//   );
// };
// interface MenuItemWithFlag extends Pick<CountrySelectProps, 'iconComponent'> {
//   onChange?: (value?: string) => void;
//   value?: CountryCode;
//   label?: string;
// }

// const MenuItemWithFlag = memo(
//   ({ onChange, iconComponent: Flag, value, label }: MenuItemWithFlag) => {
//     return (
//       <potion.button
//         w="full"
//         _hover={{ bg: 'gray.100' }}
//         type="button"
//         onClick={() => onChange?.(value)}
//       >
//         <HStack py="2" px="4" value={value}>
//           <Flag label={label} country={value} />
//           <Text textStyle="sm">
//             {label}
//             {value && (
//               <potion.span color="blackAlpha.500">{` +${getCountryCallingCode(
//                 value,
//               )}`}</potion.span>
//             )}
//           </Text>
//         </HStack>
//       </potion.button>
//     );
//   },
// );

// interface EmbeddedFlagProps {
//   title: string;
// }

// type EmbeddedFlag = (props: EmbeddedFlagProps) => JSX.Element;

// export type Flags = Partial<Record<Country, EmbeddedFlag>>;

// interface FlagProps {
//   country: Country;
//   countryName: string;
//   flagUrl?: string;
//   flags?: Flags;
// }

// const FlagIcon = ({ country, flagUrl, countryName }: FlagProps) => {
//   return <Image label={countryName} src={flagUrl?.replace('{XX}', country)} boxSize="5" />;
// };

// /**
//  * Exports a function to be fed into the PhoneNumberInput components onCountryChange prop
//  * @param - optional defaultCountry.  Default is US
//  * @returns - The currently selected country code
//  */
// export const useGetCurrentlySelectedCountry = (defaultCountry?: CountryCode) => {
//   const [country, setCountry] = useState<CountryCode | undefined>(defaultCountry ?? 'US');

//   const onCountryChange = useCallback((e?: CountryCode) => {
//     setCountry(e);
//   }, []);

//   return {
//     country,
//     onCountryChange,
//   };
// };

// /**
//  * If phone number starts with a +, its international (non-US)
//  * Otherwise, its US.  We only ever store numbers with a plus sign or without
//  * @param phoneno
//  * @returns
//  */
// export const isPhoneNumberUS = (phoneno: string) => {
//   if (phoneno.charAt(0) === '(' || phoneno.charAt(0) !== '+' || phoneno.charAt(0) === '1') {
//     return true;
//   }
//   return false;
// };

// /**
//  * This function ensures the correctly formatted phone number is returned for storage
//  * @param phonenum
//  * @param country
//  */
// export const getFormattedPhoneNumber = (phonenum: string, country: CountryCode) => {
//   return country === 'US'
//     ? parsePhoneNumber(phonenum, country).formatNational()
//     : parsePhoneNumber(phonenum, country).formatInternational();
// };
