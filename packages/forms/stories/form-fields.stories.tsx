import React from 'react';
import type { Meta, StoryObj } from "@storybook/react";
import { Field, Form } from "../src";
import { Container } from "@vastly/ui";

const meta: Meta<typeof Field> = {
  component: Field,
  title: "Elements/Field",
  decorators: [
    (Story) => (
        <Form
          defaultValues={{
            text: "Hello world",
            textArea: "Hello world",
          }}
          onSubmit={() => {}}
        >
          <Story />
        </Form>
    ),
  ],
  argTypes: {
    type: {
      disable: true
    },
    name: {
      required: true
    },
  }
};

export default meta;
type Story = StoryObj<typeof Field>;

const BasicField: Story = {  args: { type: "text", name: "text", label: "Text", helperText: "", hideLabel: false },};

export const TextField: Story = {
  args: {
    ...BasicField.args,
  }
}

export const EmailField: Story = {
  args: {
    ...BasicField.args,
    type: "email",
    name: "email",
    label: "Email",
    placeholder: "email@email.com"
  },
};

export const UrlField: Story = {
  args: { ...BasicField.args, type: "url", name: "url", label: "Url", placeholder: "google.com" },
};

export const TextareaField: Story = {
  args: { ...BasicField.args, type: "textarea", name: "textArea", label: "Textarea" },
};

/** Use the `switch` type to create a toggle */
export const SwitchField: Story = {
  args: { ...BasicField.args, type: "switch", name: "switch", label: "Switch" },
};

/**The `pin` type is optimized for entering sequences of digits quickly. Additional `pin` type props include:
 * - `mask`: boolean;
 * - `pinLength`: number,
 * - `size`: ['xs', 'sm', 'md', 'lg']
*/
export const PinField: Story = {
  argTypes: {
    pinType: { control: "select", options: ["alphanumeric", "number"] },
  },
  args: { ...BasicField.args, type: "pin", name: "pin", label: "Pin", pinLength: 5 , size:"md"},
};

export const CheckboxField: Story = {
  args: { ...BasicField.args, type: "checkbox", name: "checkbox", label: "Checkbox" },
};

const options = [
  {
    value: "1",
    label: "Option 1",
  },
  {
    value: "2",
    label: "Option 2",
  },
];

export const RadioField: Story = {
  args: { ...BasicField.args, type: "radio", name: "radio", label: "Radio", options },
};

export const NumberInputField: Story = {
  args: { ...BasicField.args, type: "number", name: "number", label: "Number" },
};


export const PasswordInputField: Story = {
  args: { ...BasicField.args, type: "password", name: "password", label: "Password" },
};

const getOptions = (length = 6) =>
  Array.from({ length }).map((_node, index) => ({
    value: String(index),
    label: `Option ${index + 1}`,
  }));

const selectOptions = getOptions();

export const NativeSelectInputField: Story = {
  args: {
    ...BasicField.args,
    type: "native-select",
    name: "select",
    label: "Native Select",
    options: selectOptions,
  },
};

export const SelectInputField: Story = {
  args: {
    ...BasicField.args,
    type: "select",
    name: "select",
    label: "Select",
    options: selectOptions,
  },
};

export const CreditCardInputField: Story = {
  args: {
    ...BasicField.args,
    type: "credit-card",
    name: "creditcard",
    label: "Credit Card",
  },
};

export const CreditCardExpiryField: Story = {
  args: {
    ...BasicField.args,
    type: "credit-expiry",
    name: "credit-expiry",
    label: "Credit Card Expiry",
  },
};

export const ReactPhoneInputField: Story = {
  args: { ...BasicField.args, type: "phone", name: "phone", label: "Phone" },
};

export const SelectCountryInputField: Story = {
  args: {
    ...BasicField.args,
    type: "select-country",
    name: "select-country",
    label: "Select Country",
  },
};

export const SelectRegionInputField: Story = {
  args: {
    ...BasicField.args,
    type: "select-region",
    name: "select-region",
    label: "Select Region",
    country: "US",
  },
};
