import type { Meta, StoryObj } from "@storybook/react";
import { DottedSpinner } from "@companydotcom/ui";

const meta: Meta<typeof DottedSpinner> = {
  component: DottedSpinner,
  title: "Components/Dotted Spinner",
};

export default meta;
type Story = StoryObj<typeof DottedSpinner>;

export const Basic: Story = {};

export const WithSizes: Story = {
  args: {
    sizes: ["xs", "sm", "md", "lg", "xl"],
  },
  render: function CustomRenderer({ sizes }) {
    return sizes.map((size: string) => <DottedSpinner size={size} key={size} />);
  },
};
