import type { Meta, StoryObj } from "@storybook/react";
import { DottedSpinner } from "../src";

const meta: Meta<typeof DottedSpinner> = {
  title: "Components/DottedSpinner",
  component: DottedSpinner,
  argTypes: {
    size: {
      options: ["xs", "sm", "md", "lg", "xl"],
      defaultValue: "lg",
      control: { type: "select"},
      description: "The size of the spinner.",
      type: "string"
    },
  },
};

export default meta;
type Story = StoryObj<typeof DottedSpinner>;


/** This is the default DottedSpinner */
export const Usage: Story = {
  args: {
    label: "Basic Spinner",
  },
};

/** Use the `size` prop to change the size of the button. You can set the value to `xs`, `sm`, `md`,`lg` or `xl`. */
export const WithSizes: Story = {
  args: {
    label: "With Sizes",
    size: ["xs", "sm", "md", "lg", "xl"],
  },
  parameters: {
    controls: {
      exclude: /^_|as|html|size/,
    }
  },
  render: ({ size }: any) => {
    return size.map((size: string) => <DottedSpinner size={size} key={size} />);
  },
};

/**Use the `color` prop to change the color scheme of the Button. You can set the value to any of the color scales from your design system, like `whiteAlpha`, `blackAlpha`, `gray`, `red`, `blue`, or your custom color scale. */
export const WithColors: Story = {
  args: {
    colorSchemes: ["cyan", "pink", "orange"],
  },
  render: ({ colorSchemes }: any) => {
    return colorSchemes.map((color: string) => <DottedSpinner color={color} key={color} />);
  },
};