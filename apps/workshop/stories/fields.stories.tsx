import type { Meta, StoryObj } from "@storybook/react";
import { Field, Form } from "@vastly/forms";
import { Container } from "@vastly/ui";

const meta: Meta<typeof Field> = {
  component: Field,
  title: "Forms/Field",
  decorators: [
    (Story) => (
      <Container>
        <Form
          defaultValues={{
            text: "Hello world",
            textArea: "Hello world",
          }}
          onSubmit={() => {}}
        >
          <Story />
        </Form>
      </Container>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Field>;

export const TextField: Story = {
  argTypes: { type: { disable: true }, name: { required: true } },
  args: { type: "text", name: "text", label: "Text", helperText: "", hideLabel: false },
};

export const EmailField: Story = {
  args: { ...TextField.args, type: "email", name: "email", label: "Email" },
};

export const UrlField: Story = {
  args: { ...TextField.args, type: "url", name: "url", label: "Url" },
};

export const TextareaField: Story = {
  args: { ...TextField.args, type: "textarea", name: "textArea", label: "Textarea" },
};

export const SwitchField: Story = {
  args: { ...TextField.args, type: "switch", name: "switch", label: "Switch" },
};

export const PinField: Story = {
  argTypes: {
    pinType: { control: "select", options: ["alphanumeric", "number"] },
  },
  args: { ...TextField.args, type: "pin", name: "pin", label: "Pin", pinLength: 5 },
};

export const CheckboxField: Story = {
  args: { ...TextField.args, type: "checkbox", name: "checkbox", label: "Checkbox" },
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
  args: { ...TextField.args, type: "radio", name: "radio", label: "Radio", options },
};

export const NumberInputField: Story = {
  args: { ...TextField.args, type: "number", name: "number", label: "Number" },
};

export const PasswordInputField: Story = {
  args: { ...TextField.args, type: "password", name: "password", label: "Password" },
};

const getOptions = (length = 6) =>
  Array.from({ length }).map((_node, index) => ({
    value: String(index),
    label: `Option ${index + 1}`,
  }));

const selectOptions = getOptions();

export const NativeSelectInputField: Story = {
  args: {
    ...TextField.args,
    type: "native-select",
    name: "select",
    label: "Native Select",
    options: selectOptions,
  },
};

export const SelectInputField: Story = {
  args: {
    ...TextField.args,
    type: "select",
    name: "select",
    label: "Select",
    options: selectOptions,
  },
};

export const CreditCardInputField: Story = {
  args: {
    ...TextField.args,
    type: "credit-card",
    name: "creditcard",
    label: "Credit Card",
  },
};

export const CreditCardExpiryField: Story = {
  args: {
    ...TextField.args,
    type: "credit-expiry",
    name: "credit-expiry",
    label: "Credit Card Expiry",
  },
};

export const ReactPhoneInputField: Story = {
  args: { ...TextField.args, type: "phone", name: "phone", label: "Phone" },
};

export const SelectCountryInputField: Story = {
  args: {
    ...TextField.args,
    type: "select-country",
    name: "select-country",
    label: "Select Country",
  },
};

export const SelectRegionInputField: Story = {
  args: {
    ...TextField.args,
    type: "select-region",
    name: "select-region",
    label: "Select Region",
    country: "US",
  },
};
