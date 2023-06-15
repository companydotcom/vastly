/* eslint-disable react/no-children-prop */
import { memo, useCallback, useRef, useState } from "react";
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
  createIcon,
} from "@vastly/ui";
import PhoneInputWithCountry, {
  type Country,
  getCountryCallingCode,
  parsePhoneNumber,
} from "react-phone-number-input";
// TODO: Remove the workaround whenever MS fixes the issue
// https://github.com/microsoft/TypeScript/issues/48212
import type { ComponentWithAs, IconProps } from "@vastly/ui";

export interface ReactPhoneInputProps extends ChakraInputProps {
  country?: Country;
  defaultCountry?: Country;
  onCountryChange?: (country?: Country) => void;
  placeholder?: string;
  withCountryCallingCode?: boolean;
  addInternationalOption?: boolean;
  international?: boolean;
}

export const ReactPhoneInput = forwardRef<ReactPhoneInputProps, "select">((props, ref) => {
  const {
    defaultCountry,
    international,
    withCountryCallingCode,
    country,
    onCountryChange,
    addInternationalOption,
    placeholder,
    size,
    ...rest
  } = props;
  return (
    <InputGroup size={size}>
      {/* @ts-ignore */}
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
        placeholder={placeholder || `+${getCountryCallingCode(country ?? "US")}` || ""}
        style={{ width: "100%" }}
        pl="3.2rem"
        {...rest}
      />
    </InputGroup>
  );
});

interface CountryItem {
  value?: Country;
  label?: string;
}

interface CountrySelectProps {
  name?: string;
  value?: string;
  onChange?: (value?: string) => void;
  options: CountryItem[];
  iconComponent: React.ElementType;
  disabled?: boolean;
  readOnly?: boolean;
  tabIndex?: number | string;
  className?: string;
}

const CountrySelect = ({ options, value, onChange, iconComponent: Flag }: CountrySelectProps) => {
  const [filteredList, setFilteredList] = useState(options);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const evalue = event.target.value.toLowerCase();
    const result =
      options?.filter((item) => {
        return item?.label?.toLowerCase().includes(evalue);
      }) || [];
    setFilteredList(result);
  };
  const initialFocusRef = useRef(null);

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
                    {isOpen ? <AngleUpIcon /> : <AngleDownIcon />}
                  </HStack>
                </chakra.button>
              </PopoverTrigger>
            }
          />
          <PopoverContent>
            <PopoverBody p="0">
              <Box py="2" px="4">
                <InputGroup size="sm">
                  <InputLeftElement pointerEvents="none" children={<SearchIcon />} />
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
  );
};

interface MenuItemWithFlag extends Pick<CountrySelectProps, "iconComponent"> {
  onChange?: (value?: string) => void;
  value?: Country;
  label?: string;
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
    );
  },
);

MenuItemWithFlag.displayName = "MenuItemWithFlag";

interface EmbeddedFlagProps {
  title: string;
}

type EmbeddedFlag = (props: EmbeddedFlagProps) => JSX.Element;

export type Flags = Partial<Record<Country, EmbeddedFlag>>;

interface FlagProps {
  country: Country;
  countryName: string;
  flagUrl?: string;
  flags?: Flags;
}

const FlagIcon = ({ country, flagUrl, countryName }: FlagProps) => {
  return (
    <Image alt={countryName || ""} src={flagUrl?.replace("{XX}", country)} width="5" minWidth="5" />
  );
};

export const AngleUpIcon = createIcon({
  displayName: "AngleUpIcon",
  viewBox: "0 0 448 512",
  d: "M206 114.7l22.6 22.6 160 160L411.3 320 366 365.3l-22.6-22.6L206 205.3 68.6 342.6 46 365.3 .7 320l22.6-22.6 160-160L206 114.7z",
});

export const AngleDownIcon = createIcon({
  displayName: "AngleDownIcon",
  viewBox: "0 0 448 512",
  d: "M169.4 342.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 274.7 54.6 137.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z",
});

export const SearchIcon = createIcon({
  displayName: "SearchIcon",
  viewBox: "0 0 512 512",
  d: "M368 208A160 160 0 1 0 48 208a160 160 0 1 0 320 0zM337.1 371.1C301.7 399.2 256.8 416 208 416C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208c0 48.8-16.8 93.7-44.9 129.1L505 471c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L337.1 371.1z",
});

interface UseGetCurrentlySelectedCountryReturn {
  country: Country | undefined;
  onCountryChange: (e?: Country) => void;
}

/**
 * Exports a function to be fed into the PhoneNumberInput components onCountryChange prop
 * @param - optional defaultCountry.  Default is US
 * @returns - The currently selected country code
 */
export const useGetCurrentlySelectedCountry = (
  defaultCountry?: Country,
): UseGetCurrentlySelectedCountryReturn => {
  const [country, setCountry] = useState<Country | undefined>(defaultCountry ?? "US");

  const onCountryChange = useCallback((e?: Country) => {
    setCountry(e);
  }, []);

  return {
    country,
    onCountryChange,
  };
};

/**
 * If phone number starts with a +, its international (non-US)
 * Otherwise, its US.  We only ever store numbers with a plus sign or without
 * @param phoneno
 * @returns
 */
export const isPhoneNumberUS = (phoneno: string) => {
  if (phoneno.charAt(0) === "(" || phoneno.charAt(0) !== "+" || phoneno.charAt(0) === "1") {
    return true;
  }
  return false;
};

/**
 * This function ensures the correctly formatted phone number is returned for storage
 * @param phonenum
 * @param country
 */
export const getFormattedPhoneNumber = (phonenum: string, country: Country) => {
  return country === "US"
    ? parsePhoneNumber(phonenum, country)?.formatNational()
    : parsePhoneNumber(phonenum, country)?.formatInternational();
};
