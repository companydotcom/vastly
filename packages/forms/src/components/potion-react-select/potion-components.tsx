import React, { ReactElement } from "react"
import {
  Box,
  CloseButton,
  Divider,
  MenuIcon,
  PropsOf,
  RecursiveCSSObject,
  Spinner,
  StylesProvider,
  SystemStyleObject,
  Tag,
  TagCloseButton,
  TagLabel,
  potion,
  createIcon,
  useMultiStyleConfig,
  useStyles,
  useTheme,
} from "@companydotcom/potion"
import {
  ClearIndicatorProps,
  ContainerProps,
  ControlProps,
  DropdownIndicatorProps,
  GroupBase,
  GroupHeadingProps,
  GroupProps,
  IndicatorSeparatorProps,
  IndicatorsContainerProps,
  InputProps,
  LoadingIndicatorProps,
  MenuListProps,
  MenuProps,
  MultiValueGenericProps,
  MultiValueProps,
  MultiValueRemoveProps,
  NoticeProps,
  OptionProps,
  PlaceholderProps,
  SingleValueProps,
  ValueContainerProps,
} from "react-select"
import { Size, SizeProps, SxProps } from "./types"
import { cleanCommonProps } from "./utils"

// Taken from the @chakra-ui/icons package to prevent needing it as a dependency
// https://github.com/chakra-ui/chakra-ui/blob/main/packages/icons/src/ChevronDown.tsx
const ChevronDown = createIcon({
  displayName: "ChevronDownIcon",
  d: "M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z",
})

// Use the CheckIcon component from the chakra menu
// https://github.com/chakra-ui/chakra-ui/blob/main/packages/menu/src/menu.tsx#L301
const CheckIcon: React.FC<PropsOf<"svg">> = (props) => (
  <svg viewBox="0 0 14 14" width="1em" height="1em" {...props}>
    <polygon
      fill="currentColor"
      points="5.5 11.9993304 14 3.49933039 12.5 2 5.5 8.99933039 1.5 4.9968652 0 6.49933039"
    />
  </svg>
)

const SelectContainer = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
  props: ContainerProps<Option, IsMulti, Group>,
): ReactElement => {
  const {
    children,
    className,
    cx,
    innerProps,
    isDisabled,
    isRtl,
    selectProps: { potionStyles },
  } = props

  const initialStyles: SystemStyleObject = {
    position: "relative",
    direction: isRtl ? "rtl" : undefined,
    // When disabled, react-select sets the pointer-state to none which prevents
    // the `not-allowed` cursor style from chakra from getting applied to the
    // Control when it is disabled
    pointerEvents: "auto",
  }

  const sx: SystemStyleObject = potionStyles?.container
    ? potionStyles.container(initialStyles, props)
    : initialStyles

  return (
    <Box
      className={cx(
        {
          "--is-disabled": isDisabled,
          "--is-rtl": isRtl,
        },
        className,
      )}
      sx={sx}
      {...innerProps}
    >
      {children}
    </Box>
  )
}

const ValueContainer = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
  props: ValueContainerProps<Option, IsMulti, Group>,
): ReactElement => {
  const {
    children,
    className,
    cx,
    isMulti,
    hasValue,
    selectProps: { size, potionStyles },
  } = props

  const px: SizeProps = {
    sm: "0.75rem",
    md: "1rem",
    lg: "1rem",
  }

  const initialStyles: SystemStyleObject = {
    d: "flex",
    alignItems: "center",
    flex: 1,
    p: `0.125rem ${px[size as Size]}`,
    flexWrap: "wrap",
    WebkitOverflowScrolling: "touch",
    position: "relative",
    overflow: "hidden",
  }

  const sx: SystemStyleObject = potionStyles?.valueContainer
    ? potionStyles.valueContainer(initialStyles, props)
    : initialStyles

  return (
    <Box
      className={cx(
        {
          "value-container": true,
          "value-container--is-multi": isMulti,
          "value-container--has-value": hasValue,
        },
        className,
      )}
      sx={sx}
    >
      {children}
    </Box>
  )
}

const IndicatorsContainer = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
  props: IndicatorsContainerProps<Option, IsMulti, Group>,
): ReactElement => {
  const {
    children,
    className,
    cx,
    selectProps: { potionStyles },
  } = props

  const initialStyles: SystemStyleObject = {
    d: "flex",
    alignItems: "center",
    alignSelf: "stretch",
    flexShrink: 0,
  }

  const sx: SystemStyleObject = potionStyles?.indicatorsContainer
    ? potionStyles.indicatorsContainer(initialStyles, props)
    : initialStyles

  return (
    <Box
      className={cx(
        {
          indicators: true,
        },
        className,
      )}
      sx={sx}
    >
      {children}
    </Box>
  )
}

const Control = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
  props: ControlProps<Option, IsMulti, Group>,
): ReactElement => {
  const {
    className,
    cx,
    children,
    innerRef,
    innerProps,
    isDisabled,
    isFocused,
    menuIsOpen,
    selectProps: { size, isInvalid, potionStyles, focusBorderColor, errorBorderColor },
  } = props

  const inputStyles = useMultiStyleConfig("Input", {
    focusBorderColor,
    errorBorderColor,
    size,
  })

  const heights: SizeProps = {
    sm: 8,
    md: 10,
    lg: 12,
  }

  const initialStyles: SystemStyleObject = {
    ...inputStyles.field,
    d: "flex",
    p: 0,
    overflow: "hidden",
    h: "auto",
    minH: heights[size as Size],
  }

  const sx: SystemStyleObject = potionStyles?.control
    ? potionStyles.control(initialStyles, props)
    : initialStyles

  return (
    <StylesProvider value={inputStyles}>
      <Box
        ref={innerRef}
        className={cx(
          {
            control: true,
            "control--is-disabled": isDisabled,
            "control--is-focused": isFocused,
            "control--menu-is-open": menuIsOpen,
          },
          className,
        )}
        sx={sx}
        {...innerProps}
        data-focus={isFocused ? true : undefined}
        data-invalid={isInvalid ? true : undefined}
        data-disabled={isDisabled ? true : undefined}
      >
        {children}
      </Box>
    </StylesProvider>
  )
}

const Placeholder = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
  props: PlaceholderProps<Option, IsMulti, Group>,
): ReactElement => {
  const {
    children,
    className,
    cx,
    innerProps,
    selectProps: { placeholderColor, potionStyles },
  } = props

  const initialStyles: SystemStyleObject = {
    color: placeholderColor,
    mx: "0.125rem",
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
  }

  const sx: SystemStyleObject = potionStyles?.placeholder
    ? potionStyles.placeholder(initialStyles, props)
    : initialStyles

  return (
    <Box
      className={cx(
        {
          placeholder: true,
        },
        className,
      )}
      sx={sx}
      {...innerProps}
    >
      {children}
    </Box>
  )
}

// Multi Value
const MultiValue = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
  props: MultiValueProps<Option, IsMulti, Group>,
): ReactElement => {
  const {
    children,
    className,
    components,
    cx,
    data,
    innerProps,
    isDisabled,
    isFocused,
    removeProps,
    selectProps,
  } = props

  const { Container, Label, Remove } = components

  const { potionStyles } = selectProps

  const containerInitialStyles: SystemStyleObject = { m: "0.125rem" }
  const containerSx: SystemStyleObject = potionStyles?.multiValue
    ? potionStyles.multiValue(containerInitialStyles, props)
    : containerInitialStyles

  const labelSx: SystemStyleObject = potionStyles?.multiValueLabel
    ? potionStyles.multiValueLabel({}, props)
    : {}

  const removeSx: SystemStyleObject = potionStyles?.multiValueRemove
    ? potionStyles.multiValueRemove({}, props)
    : {}

  return (
    <Container
      data={data}
      innerProps={{
        className: cx(
          {
            "multi-value": true,
            "multi-value--is-disabled": isDisabled,
          },
          className,
        ),
        ...innerProps,
      }}
      sx={containerSx}
      selectProps={selectProps}
    >
      <Label
        data={data}
        innerProps={{
          className: cx(
            {
              "multi-value__label": true,
            },
            className,
          ),
        }}
        sx={labelSx}
        selectProps={selectProps}
      >
        {children}
      </Label>
      <Remove
        data={data}
        innerProps={{
          className: cx(
            {
              "multi-value__remove": true,
            },
            className,
          ),
          "aria-label": `Remove ${children || "option"}`,
          ...removeProps,
        }}
        sx={removeSx}
        selectProps={selectProps}
        isFocused={isFocused}
      />
    </Container>
  )
}

const MultiValueContainer = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
  props: MultiValueGenericProps<Option, IsMulti, Group>,
): ReactElement => {
  const { children, innerProps, data, selectProps, sx } = props

  return (
    <Tag
      {...innerProps}
      // react-select Fixed Options example:
      // https://react-select.com/home#fixed-options
      variant={data.variant || selectProps.tagVariant || (data.isFixed ? "solid" : "subtle")}
      colorScheme={data.colorScheme || selectProps.colorScheme}
      size={selectProps.size}
      sx={sx}
    >
      {children}
    </Tag>
  )
}

const MultiValueLabel = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
  props: MultiValueGenericProps<Option, IsMulti, Group>,
): ReactElement => {
  const { children, innerProps, sx } = props

  return (
    <TagLabel {...innerProps} sx={sx}>
      {children}
    </TagLabel>
  )
}

const MultiValueRemove = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
  props: MultiValueRemoveProps<Option, IsMulti, Group>,
): ReactElement | null => {
  const { children, innerProps, isFocused, data, sx } = props

  // @ts-ignore `isFixed` is not found on the default Option object
  // not sure how to extend it internally
  if (data.isFixed) {
    return null
  }

  return (
    // @ts-ignore the `innerProps` type is not compatible with the props
    // accepted by the `TagCloseButton`. The most likely solution in the long
    // term is using a `chakra.button` instead of a TagCloseButton and styling
    // it using the multi style config of a tag close button.
    <TagCloseButton {...innerProps} sx={sx} tabIndex={-1} data-focus={isFocused ? true : undefined}>
      {children}
    </TagCloseButton>
  )
}

// Single Value
const SingleValue = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
  props: SingleValueProps<Option, IsMulti, Group>,
): ReactElement => {
  const {
    children,
    className,
    cx,
    isDisabled,
    innerProps,
    selectProps: { potionStyles },
  } = props

  const initialStyles: SystemStyleObject = {
    label: "singleValue",
    mx: "0.125rem",
    maxWidth: `calc(100% - 0.5rem)`,
    overflow: "hidden",
    position: "absolute",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    top: "50%",
    transform: "translateY(-50%)",
  }

  const sx: SystemStyleObject = potionStyles?.singleValue
    ? potionStyles.singleValue(initialStyles, props)
    : initialStyles

  return (
    <Box
      className={cx(
        {
          "single-value": true,
          "single-value--is-disabled": isDisabled,
        },
        className,
      )}
      sx={sx}
      {...innerProps}
    >
      {children}
    </Box>
  )
}

// Indicators
const IndicatorSeparator = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
  props: IndicatorSeparatorProps<Option, IsMulti, Group>,
): ReactElement => {
  const {
    className,
    cx,
    selectProps: { potionStyles },
  } = props

  const initialStyles: SystemStyleObject = { opacity: 1 }

  const sx: SystemStyleObject = potionStyles?.indicatorSeparator
    ? potionStyles.indicatorSeparator(initialStyles, props)
    : initialStyles

  return (
    <Divider
      className={cx({ "indicator-separator": true }, className)}
      sx={sx}
      orientation="vertical"
    />
  )
}

const ClearIndicator = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
  props: ClearIndicatorProps<Option, IsMulti, Group>,
): ReactElement => {
  const {
    className,
    cx,
    innerProps,
    isFocused,
    selectProps: { size, potionStyles },
  } = props

  const initialStyles: SystemStyleObject = { mx: 1 }

  const sx: SystemStyleObject = potionStyles?.clearIndicator
    ? potionStyles.clearIndicator(initialStyles, props)
    : initialStyles

  return (
    // @ts-ignore the `innerProps` type is meant for a div element, not a
    // button like this is.  I'm not sure how to cast the type for these
    // props into a type that the `CloseButton` component will be happe with
    <CloseButton
      className={cx(
        {
          indicator: true,
          "clear-indicator": true,
        },
        className,
      )}
      size={size}
      sx={sx}
      tabIndex={-1}
      data-focused={isFocused ? true : undefined}
      aria-label="Clear selected options"
      {...innerProps}
    />
  )
}

const DropdownIndicator = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
  props: DropdownIndicatorProps<Option, IsMulti, Group>,
): ReactElement => {
  const {
    className,
    cx,
    innerProps,
    selectProps: { size, potionStyles },
  } = props

  const { addon } = useStyles()

  const iconSizes: SizeProps = {
    sm: 4,
    md: 5,
    lg: 6,
  }
  const iconSize = iconSizes[size as Size]

  const initialStyles: SystemStyleObject = {
    ...addon,
    d: "flex",
    alignItems: "center",
    justifyContent: "center",
    h: "100%",
    borderRadius: 0,
    borderWidth: 0,
    background: "transparent",
    paddingX: 2,
  }

  const sx: SystemStyleObject = potionStyles?.dropdownIndicator
    ? potionStyles.dropdownIndicator(initialStyles, props)
    : initialStyles

  return (
    <Box
      {...innerProps}
      className={cx(
        {
          indicator: true,
          "dropdown-indicator": true,
        },
        className,
      )}
      sx={sx}
    >
      <ChevronDown h={iconSize} w={iconSize} />
    </Box>
  )
}

const LoadingIndicator = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
  props: LoadingIndicatorProps<Option, IsMulti, Group>,
): ReactElement => {
  const {
    className,
    cx,
    innerProps,
    selectProps: { size, potionStyles },
  } = props

  const spinnerSizes: SizeProps = {
    sm: "xs",
    md: "sm",
    lg: "md",
  }

  const spinnerSize = spinnerSizes[size as Size]

  const initialStyles: SystemStyleObject = { mr: 3 }

  const sx: SystemStyleObject = potionStyles?.loadingIndicator
    ? potionStyles.loadingIndicator(initialStyles, props)
    : initialStyles

  return (
    <Spinner
      className={cx(
        {
          indicator: true,
          "loading-indicator": true,
        },
        className,
      )}
      sx={sx}
      {...innerProps}
      size={spinnerSize as Size}
    />
  )
}

// Menu components
const Menu = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
  props: MenuProps<Option, IsMulti, Group>,
): ReactElement => {
  const {
    className,
    cx,
    children,
    innerProps,
    innerRef,
    placement,
    selectProps: { size, potionStyles },
  } = props

  const menuStyles = useMultiStyleConfig("Menu", {})

  const chakraTheme = useTheme()
  const borderRadii: SizeProps = {
    sm: chakraTheme.radii.sm,
    md: chakraTheme.radii.md,
    lg: chakraTheme.radii.md,
  }

  const initialStyles: SystemStyleObject = {
    position: "absolute",
    ...(placement === "bottom" && { top: "100%" }),
    ...(placement === "top" && { bottom: "100%" }),
    my: "8px",
    w: "100%",
    zIndex: 1,
    overflow: "hidden",
    rounded: borderRadii[size as Size],
  }

  const sx: SystemStyleObject = potionStyles?.menu
    ? potionStyles.menu(initialStyles, props)
    : initialStyles

  return (
    <Box ref={innerRef} className={cx({ menu: true }, className)} sx={sx} {...innerProps}>
      <StylesProvider value={menuStyles}>{children}</StylesProvider>
    </Box>
  )
}

const MenuList = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
  props: MenuListProps<Option, IsMulti, Group>,
): ReactElement => {
  const {
    className,
    cx,
    innerRef,
    children,
    maxHeight,
    isMulti,
    selectProps: { size, potionStyles },
  } = props

  const { list } = useStyles()

  const chakraTheme = useTheme()
  const borderRadii: SizeProps = {
    sm: chakraTheme.radii.sm,
    md: chakraTheme.radii.md,
    lg: chakraTheme.radii.md,
  }

  const initialStyles: SystemStyleObject = {
    ...list,
    maxH: `${maxHeight}px`,
    overflowY: "auto",
    borderRadius: borderRadii[size as Size],
  }

  const sx: SystemStyleObject = potionStyles?.menuList
    ? potionStyles.menuList(initialStyles, props)
    : initialStyles

  return (
    <Box
      className={cx(
        {
          "menu-list": true,
          "menu-list--is-multi": isMulti,
        },
        className,
      )}
      sx={sx}
      ref={innerRef}
    >
      {children}
    </Box>
  )
}

const Group = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
  props: GroupProps<Option, IsMulti, Group>,
): ReactElement => {
  const { children, className, cx, theme, getStyles, Heading, headingProps, label, selectProps } =
    props

  const { potionStyles } = selectProps

  const sx: SystemStyleObject = potionStyles?.group ? potionStyles.group({}, props) : {}

  return (
    <Box className={cx({ group: true }, className)} sx={sx}>
      <Heading
        {...headingProps}
        selectProps={selectProps}
        cx={cx}
        theme={theme}
        getStyles={getStyles}
      >
        {label}
      </Heading>
      <Box>{children}</Box>
    </Box>
  )
}

const GroupHeading = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
  props: GroupHeadingProps<Option, IsMulti, Group>,
): ReactElement => {
  const {
    cx,
    className,
    children,
    selectProps: { size, hasStickyGroupHeaders, potionStyles },
  } = props

  const {
    groupTitle,
    list: { bg },
  } = useStyles()

  const chakraTheme = useTheme()
  const fontSizes: SizeProps = {
    sm: chakraTheme.fontSizes.xs,
    md: chakraTheme.fontSizes.sm,
    lg: chakraTheme.fontSizes.md,
  }
  const paddings: SizeProps = {
    sm: "0.4rem 0.8rem",
    md: "0.5rem 1rem",
    lg: "0.6rem 1.2rem",
  }

  const initialStyles: SystemStyleObject = {
    ...groupTitle,
    fontSize: fontSizes[size as Size],
    p: paddings[size as Size],
    m: 0,
    borderBottomWidth: hasStickyGroupHeaders ? "1px" : 0,
    position: hasStickyGroupHeaders ? "sticky" : "static",
    top: -2,
    bg,
  }

  const sx: SystemStyleObject = potionStyles?.groupHeading
    ? potionStyles.groupHeading(initialStyles, props)
    : initialStyles

  return (
    <Box className={cx({ "group-heading": true }, className)} sx={sx}>
      {children}
    </Box>
  )
}

const Option = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
  props: OptionProps<Option, IsMulti, Group>,
): ReactElement => {
  const {
    className,
    cx,
    innerRef,
    innerProps,
    children,
    isFocused,
    isDisabled,
    isSelected,
    selectProps: {
      size,
      isMulti,
      hideSelectedOptions,
      selectedOptionStyle,
      selectedOptionColor,
      potionStyles,
    },
  } = props

  const { item } = useStyles()

  const paddings: SizeProps = {
    sm: "0.3rem 0.6rem",
    md: "0.4rem 0.8rem",
    lg: "0.5rem 1rem",
  }

  // Don't create exta space for the checkmark if using a multi select with
  // options that dissapear when they're selected
  const showCheckIcon: boolean =
    selectedOptionStyle === "check" && (!isMulti || hideSelectedOptions === false)

  const shouldHighlight: boolean = selectedOptionStyle === "color" && isSelected

  const initialStyles: SystemStyleObject = {
    ...item,
    d: "flex",
    alignItems: "center",
    w: "100%",
    textAlign: "start",
    fontSize: size,
    p: paddings[size as Size],
    bg: isFocused ? (item as RecursiveCSSObject<SxProps>)._focus.bg : "transparent",
    ...(shouldHighlight && {
      bg: `${selectedOptionColor}.500`,
      color: "white",
      _active: { bg: `${selectedOptionColor}.500` },
    }),
    ...(isDisabled && (item as RecursiveCSSObject<SxProps>)._disabled),
  }

  const sx: SystemStyleObject = potionStyles?.option
    ? potionStyles.option(initialStyles, props)
    : initialStyles

  return (
    <Box
      role="button"
      className={cx(
        {
          option: true,
          "option--is-disabled": isDisabled,
          "option--is-focused": isFocused,
          "option--is-selected": isSelected,
        },
        className,
      )}
      sx={sx}
      ref={innerRef}
      {...innerProps}
      disabled={isDisabled ? true : undefined}
    >
      {showCheckIcon && (
        <MenuIcon fontSize="0.8em" marginEnd="0.75rem" opacity={isSelected ? 1 : 0}>
          <CheckIcon />
        </MenuIcon>
      )}
      {children}
    </Box>
  )
}

// Messages
const LoadingMessage = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
  props: NoticeProps<Option, IsMulti, Group>,
): ReactElement => {
  const {
    children,
    className,
    cx,
    innerProps,
    selectProps: { size, placeholderColor, potionStyles },
  } = props

  const fontSizes: SizeProps = {
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
  }

  const paddings: SizeProps = {
    sm: "6px 9px",
    md: "8px 12px",
    lg: "10px 15px",
  }

  const initialStyles: SystemStyleObject = {
    color: placeholderColor,
    textAlign: "center",
    p: paddings[size as Size],
    fontSize: fontSizes[size as Size],
  }

  const sx: SystemStyleObject = potionStyles?.loadingMessage
    ? potionStyles.loadingMessage(initialStyles, props)
    : initialStyles

  return (
    <Box
      className={cx(
        {
          "menu-notice": true,
          "menu-notice--loading": true,
        },
        className,
      )}
      sx={sx}
      {...innerProps}
    >
      {children}
    </Box>
  )
}

const NoOptionsMessage = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
  props: NoticeProps<Option, IsMulti, Group>,
): ReactElement => {
  const {
    children,
    className,
    cx,
    innerProps,
    selectProps: { size, placeholderColor, potionStyles },
  } = props

  const fontSizes: SizeProps = {
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
  }

  const paddings: SizeProps = {
    sm: "6px 9px",
    md: "8px 12px",
    lg: "10px 15px",
  }

  const initialStyles: SystemStyleObject = {
    color: placeholderColor,
    textAlign: "center",
    p: paddings[size as Size],
    fontSize: fontSizes[size as Size],
  }

  const sx: SystemStyleObject = potionStyles?.noOptionsMessage
    ? potionStyles.noOptionsMessage(initialStyles, props)
    : initialStyles

  return (
    <Box
      className={cx(
        {
          "menu-notice": true,
          "menu-notice--no-options": true,
        },
        className,
      )}
      sx={sx}
      {...innerProps}
    >
      {children}
    </Box>
  )
}

const Input = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
  props: InputProps<Option, IsMulti, Group>,
): ReactElement => {
  const {
    className,
    cx,
    value,
    selectProps: { potionStyles },
  } = props
  const { innerRef, isDisabled, isHidden, inputClassName, ...innerProps } = cleanCommonProps(props)

  const spacingStyle: SystemStyleObject = {
    gridArea: "1 / 2",
    font: "inherit",
    minW: "2px",
    border: 0,
    m: 0,
    outline: 0,
  }

  const initialContainerStyles: SystemStyleObject = {
    flex: "1 1 auto",
    display: "inline-grid",
    gridArea: "1 / 1 / 2 / 3",
    gridTemplateColumns: "0 min-content",
    color: "inherit",
    _after: {
      content: 'attr(data-value) " "',
      visibility: "hidden",
      whiteSpace: "pre",
      p: 0,
      ...spacingStyle,
    },
  }

  const containerStyles = potionStyles?.inputContainer
    ? potionStyles.inputContainer(initialContainerStyles, props)
    : initialContainerStyles

  const initialInputStyles = {
    label: "input",
    color: "inherit",
    bg: 0,
    opacity: isHidden ? 0 : 1,
    w: "100%",
    py: "0.125rem",
    ...spacingStyle,
  }

  const inputStyles = potionStyles?.input
    ? potionStyles.input(initialInputStyles, props)
    : initialInputStyles

  return (
    <Box
      className={cx({ "input-container": true }, className)}
      data-value={value || ""}
      sx={containerStyles}
    >
      <potion.input
        className={cx({ input: true }, inputClassName)}
        ref={innerRef}
        sx={inputStyles}
        disabled={isDisabled}
        {...innerProps}
      />
    </Box>
  )
}

const potionComponents = {
  ClearIndicator,
  Control,
  DropdownIndicator,
  Group,
  GroupHeading,
  IndicatorSeparator,
  IndicatorsContainer,
  Input,
  LoadingIndicator,
  LoadingMessage,
  Menu,
  MenuList,
  MultiValue,
  MultiValueContainer,
  MultiValueLabel,
  MultiValueRemove,
  NoOptionsMessage,
  Option,
  Placeholder,
  SelectContainer,
  SingleValue,
  ValueContainer,
}

export default potionComponents
