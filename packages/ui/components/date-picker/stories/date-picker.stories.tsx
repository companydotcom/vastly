import React, { useState } from "react";
import { ComponentMeta } from "@storybook/react";
import { ReactDatePickerCustomHeaderProps } from "react-datepicker";
import {
  Flex,
  IconButton,
  ButtonGroup,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Box,
  Icon,
  IconProps,
  VStack,
} from "../..";
import { DatePicker } from "../date-picker";

export default {
  title: "Potion/Forms/Date Picker",
  component: DatePicker,
  decorators: [
    Story => (
      <Box backgroundColor="white" p={6}>
        <Box maxW={460}>
          <Story />
        </Box>
      </Box>
    ),
  ],
} as ComponentMeta<typeof DatePicker>;

export const Basic = () => {
  const [startDate, setStartDate] = useState<Date>();

  return <DatePicker selected={startDate} onChange={date => setStartDate(date as Date)} />;
};

export const WithSize = () => {
  const [startDate, setStartDate] = useState<Date>();

  return (
    <VStack width="full" spacing={4}>
      {["sm", "md"].map(size => (
        <>
          <p>{size}</p>
          <DatePicker
            key={size}
            size={size}
            selected={startDate}
            onChange={date => setStartDate(date as Date)}
          />
        </>
      ))}
    </VStack>
  );
};

const CustomHeader = ({
  date,
  changeMonth,
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
    <Flex align="center" justify="space-between" py={2} pl={4} pr={2}>
      <Menu>
        <MenuButton>
          <Flex direction="row" align="center">
            <Text fontSize="lg" fontWeight="bold" mr={1}>
              {months[getMonth(date)]}
            </Text>
            <CaretDown />
          </Flex>
        </MenuButton>
        <MenuList>
          {months.map(opt => (
            <MenuItem
              // @ts-ignore
              onClick={e => changeMonth(months.indexOf(e.target.value))}
              key={opt}
              value={opt}
            >
              {opt}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
      <ButtonGroup size="xs">
        <IconButton
          variant="ghost"
          size="md"
          aria-label="Previous month"
          isDisabled={prevMonthButtonDisabled}
          onClick={decreaseMonth}
          icon={<AngleLeft color="black" />}
        />
        <IconButton
          variant="ghost"
          size="md"
          aria-label="Next month"
          isDisabled={nextMonthButtonDisabled}
          onClick={increaseMonth}
          icon={<AngleRight color="black" />}
        />
      </ButtonGroup>
    </Flex>
  );
};

export const WithCustomHeader = () => {
  const [startDate, setStartDate] = useState<Date>();

  return (
    <DatePicker
      size="md"
      renderCustomHeader={CustomHeader}
      selected={startDate}
      onChange={date => setStartDate(date as Date)}
    />
  );
};

const AngleLeft = (props: IconProps) => (
  <Icon viewBox="0 0 256 512" {...props}>
    <path
      fill="currentColor"
      d="M192 448c-8.188 0-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25l160-160c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l137.4 137.4c12.5 12.5 12.5 32.75 0 45.25C208.4 444.9 200.2 448 192 448z"
    />
  </Icon>
);

const AngleRight = (props: IconProps) => (
  <Icon viewBox="0 0 256 512" {...props}>
    <path
      fill="currentColor"
      d="M64 448c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L178.8 256L41.38 118.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l160 160c12.5 12.5 12.5 32.75 0 45.25l-160 160C80.38 444.9 72.19 448 64 448z"
    />
  </Icon>
);

const CaretDown = (props: IconProps) => (
  <Icon viewBox="0 0 320 512" {...props}>
    <path
      fill="currentColor"
      d="M310.6 246.6l-127.1 128C176.4 380.9 168.2 384 160 384s-16.38-3.125-22.63-9.375l-127.1-128C.2244 237.5-2.516 223.7 2.438 211.8S19.07 192 32 192h255.1c12.94 0 24.62 7.781 29.58 19.75S319.8 237.5 310.6 246.6z"
    />
  </Icon>
);
