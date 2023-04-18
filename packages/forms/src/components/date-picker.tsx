import * as React from "react";

import ReactDatePicker, {
  ReactDatePickerProps,
  ReactDatePickerCustomHeaderProps,
} from "react-datepicker";
import {
  Input,
  InputGroup,
  InputLeftElement,
  IconButton,
  Box,
  Flex,
  Text,
  Icon,
  IconProps,
  ThemingProps,
  SystemStyleObject,
  useMultiStyleConfig,
  omitThemingProps,
  forwardRef,
} from "@chakra-ui/react";

import "react-datepicker/dist/react-datepicker.css";

export interface DatePickerProps extends ReactDatePickerProps, ThemingProps<"DatePicker"> {
  inputStyles?: SystemStyleObject;
}

export const DatePicker: React.FC<DatePickerProps> = (props) => {
  const styles = useMultiStyleConfig("DatePicker", props);
  const ownProps = omitThemingProps(props);

  const customStyles = {
    ".react-datepicker": {
      ...styles.container,
    },
    ".react-datepicker-popper": {
      zIndex: 5,
    },
    ".react-datepicker__header": {
      ...styles.header,
    },
    ".react-datepicker__current-month": {
      ...styles.title,
    },
    ".datepicker__navicon": {
      ...styles.navIcon,
    },
    ".react-datepicker__day-name, .react-datepicker__day, .react-datepicker__time-name": {
      ...styles.day,
    },
    ".react-datepicker__day--keyboard-selected, .react-datepicker__month-text--keyboard-selected, .react-datepicker__quarter-text--keyboard-selected, .react-datepicker__year-text--keyboard-selected":
      {
        // @ts-ignore
        ...styles.day?.["_selected"],
      },
    ".react-datepicker__day--keyboard-selected:hover, .react-datepicker__month-text--keyboard-selected:hover, .react-datepicker__quarter-text--keyboard-selected:hover, .react-datepicker__year-text--keyboard-selected:hover":
      {
        // @ts-ignore
        ...styles.day?.["_selected"]["_hover"],
      },
    ".react-datepicker__day--selected:hover, .react-datepicker__day--in-selecting-range:hover, .react-datepicker__day--in-range:hover, .react-datepicker__month-text--selected:hover, .react-datepicker__month-text--in-selecting-range:hover, .react-datepicker__month-text--in-range:hover, .react-datepicker__quarter-text--selected:hover, .react-datepicker__quarter-text--in-selecting-range:hover, .react-datepicker__quarter-text--in-range:hover, .react-datepicker__year-text--selected:hover, .react-datepicker__year-text--in-selecting-range:hover, .react-datepicker__year-text--in-range:hover":
      {
        // @ts-ignore
        ...styles.day?.["_hover"],
      },
  };

  const CustomHeader = ({
    date,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }: ReactDatePickerCustomHeaderProps) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    function getMonth(date: Date) {
      return date?.getMonth();
    }

    return (
      <Flex align="center" justify="space-between">
        <IconButton
          variant="ghost"
          size={props.size ?? "sm"}
          aria-label="Previous month"
          isDisabled={prevMonthButtonDisabled}
          onClick={decreaseMonth}
          icon={<AngleLeft className="datepicker__navicon" />}
          ml={2}
        />
        <Text className="react-datepicker__current-month">{months[getMonth(date)]}</Text>
        <IconButton
          variant="ghost"
          size={props.size ?? "sm"}
          aria-label="Next month"
          isDisabled={nextMonthButtonDisabled}
          onClick={increaseMonth}
          icon={<AngleRight className="datepicker__navicon" />}
          mr={2}
        />
      </Flex>
    );
  };

  return (
    <Box sx={customStyles}>
      <ReactDatePicker
        renderCustomHeader={props?.renderCustomHeader ?? CustomHeader}
        showPopperArrow={props?.showPopperArrow ?? false}
        customInput={<CustomInput autoComplete="off" sx={props.inputStyles} />}
        {...ownProps}
      />
    </Box>
  );
};

const CustomInput = forwardRef(({ value, onClick, throwAwayRef: _, onChange, ...props }, ref) => (
  <InputGroup>
    {/* eslint-disable-next-line react/no-children-prop */}
    <InputLeftElement children={<CalendarDays />} />
    <Input
      paddingLeft="2rem"
      ref={ref}
      value={value}
      onClick={onClick}
      onChange={onChange}
      {...props}
      autoComplete="off"
    />
  </InputGroup>
));

export const CalendarDays = (props: IconProps) => (
  <Icon viewBox="0 0 448 512" {...props}>
    <path
      fill="currentColor"
      d="M160 32V64H288V32C288 14.33 302.3 0 320 0C337.7 0 352 14.33 352 32V64H400C426.5 64 448 85.49 448 112V160H0V112C0 85.49 21.49 64 48 64H96V32C96 14.33 110.3 0 128 0C145.7 0 160 14.33 160 32zM0 192H448V464C448 490.5 426.5 512 400 512H48C21.49 512 0 490.5 0 464V192zM64 304C64 312.8 71.16 320 80 320H112C120.8 320 128 312.8 128 304V272C128 263.2 120.8 256 112 256H80C71.16 256 64 263.2 64 272V304zM192 304C192 312.8 199.2 320 208 320H240C248.8 320 256 312.8 256 304V272C256 263.2 248.8 256 240 256H208C199.2 256 192 263.2 192 272V304zM336 256C327.2 256 320 263.2 320 272V304C320 312.8 327.2 320 336 320H368C376.8 320 384 312.8 384 304V272C384 263.2 376.8 256 368 256H336zM64 432C64 440.8 71.16 448 80 448H112C120.8 448 128 440.8 128 432V400C128 391.2 120.8 384 112 384H80C71.16 384 64 391.2 64 400V432zM208 384C199.2 384 192 391.2 192 400V432C192 440.8 199.2 448 208 448H240C248.8 448 256 440.8 256 432V400C256 391.2 248.8 384 240 384H208zM320 432C320 440.8 327.2 448 336 448H368C376.8 448 384 440.8 384 432V400C384 391.2 376.8 384 368 384H336C327.2 384 320 391.2 320 400V432z"
    />
  </Icon>
);

export const AngleLeft = (props: IconProps) => (
  <Icon viewBox="0 0 256 512" {...props}>
    <path
      fill="currentColor"
      d="M192 448c-8.188 0-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25l160-160c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l137.4 137.4c12.5 12.5 12.5 32.75 0 45.25C208.4 444.9 200.2 448 192 448z"
    />
  </Icon>
);

export const AngleRight = (props: IconProps) => (
  <Icon viewBox="0 0 256 512" {...props}>
    <path
      fill="currentColor"
      d="M64 448c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L178.8 256L41.38 118.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l160 160c12.5 12.5 12.5 32.75 0 45.25l-160 160C80.38 444.9 72.19 448 64 448z"
    />
  </Icon>
);
