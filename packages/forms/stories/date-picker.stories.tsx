import React, { useState } from 'react';
import type { Meta, StoryObj } from "@storybook/react";
import { DatePicker, ReactDatePickerCustomHeaderProps } from '../src'
import {
  IconProps,
  Icon,
  Flex,
  Menu,
  MenuButton,
  Text,
  MenuList,
  MenuItem,
  Stack,
  Container,
} from "@vastly/ui";

const meta: Meta<typeof DatePicker> = {
  component: DatePicker,
  title: "Components/Date Picker",
  argTypes: {
    size: {
      options: [ "sm", "md"],
      control: { type: "select"},
      description: "The size of the spinner.",
      type: "string"
    },
  },
  decorators: [(Story) => (
    <Container h='50vh'>
    <Story />
  </Container>
  )]
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

/** A simple `Datepicker` component for React. This example is set to `open`. To change this setting, pass the `open` prop set to false or remove */
export const Basic: Story = {
  render: ({size, ...args}) => {
    const [startDate, setStartDate] = useState<Date>();

    return <DatePicker selected={startDate} onChange={(date) => setStartDate(date as Date)} size={size} open={true} />;
  },
};

/** Use the `size` prop to change the size of the button. You can set the value to `sm` or `md` */
export const WithSizes: Story = {
  args: {
    size: ["sm", "md"],
  },
  parameters: {
    controls: {
      exclude: /^size/,
    }
  },
  render: ({size, ...args}: any) => {
    const [startDate, setStartDate] = useState<Date>();
    return (
      <Stack width="full" direction="row" justifyContent="space-around">
      {size.map((s: string) => (
          <DatePicker
            key={s}
            size={s}
            selected={startDate}
            onChange={(date) => setStartDate(date as Date)}
            inputStyles={{"border-color": "black"}}
          />
      ))}
     </Stack>
    );
  },
};

/**Use the `renderCustomHeader` prop to customize your `DatePicker`. The `renderCustomHeader` prop accepts the following args:
 * ```
 * {
    monthDate: Date;
    date: Date;
    changeYear(year: number): void;
    changeMonth(month: number): void;
    customHeaderCount: number;
    decreaseMonth(): void;
    increaseMonth(): void;
    prevMonthButtonDisabled: boolean;
    nextMonthButtonDisabled: boolean;
    decreaseYear(): void;
    increaseYear(): void;
    prevYearButtonDisabled: boolean;
    nextYearButtonDisabled: boolean;
}
 *```
 */
export const WithCustomHeader: Story = {
  render: () => {
    const [startDate, setStartDate] = useState<Date>();
    const months = [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ]

    return (
      <DatePicker
        open
        renderCustomHeader={({date, changeMonth}: ReactDatePickerCustomHeaderProps) => (
          <Menu>
            <MenuButton>
          <Flex direction="row" align="center">
            <Text fontSize="lg" fontWeight="bold" mr={1} color="magenta">
              {months[date.getMonth()]}
            </Text>
            <CaretDown />
          </Flex>
        </MenuButton>
          <MenuList>
          {months.map((opt) => (
            <MenuItem
              onClick={(e) => changeMonth(months.indexOf((e.target as HTMLButtonElement).value))}
              key={opt}
              value={opt}
            >
              {opt}
            </MenuItem>
          ))}
        </MenuList>
          </Menu>
        )}
        selected={startDate}
        onChange={(date) => setStartDate(date as Date)}
      />
    );
  }
};

// DatePicker utils
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
