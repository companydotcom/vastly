import type { Meta, StoryObj } from "@storybook/react";
import { Pagination, usePagination, PaginationContainer, PaginationItem } from "@companydotcom/ui";

const meta: Meta<typeof Pagination> = {
  component: Pagination,
  title: "Components/Pagination",
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Basic: Story = {
  render: function CustomRenderer() {
    const { items } = usePagination({ count: 8 });
    return (
      <Pagination>
        <PaginationContainer>
          {items.map((item: any) => (
            <PaginationItem {...item} />
          ))}
        </PaginationContainer>
      </Pagination>
    );
  },
};

export const WithSizes: Story = {
  args: {
    sizes: ["xs", "sm", "md", "lg"],
  },
  render: function CustomRenderer({ sizes }) {
    const { items } = usePagination({ count: 8 });
    return sizes.map((size: string) => (
      <Pagination size={size} key={size} mb="4">
        <PaginationContainer>
          {items.map((item: any) => (
            <PaginationItem {...item} />
          ))}
        </PaginationContainer>
      </Pagination>
    ));
  },
};

export const WithVariants: Story = {
  args: {
    variants: ["ghost", "outline", "unstyled"],
  },
  render: function CustomRenderer({ variants }) {
    const { items } = usePagination({ count: 8 });
    return variants.map((variant: string) => (
      <Pagination size={variant} key={variant} mb="4">
        <PaginationContainer>
          {items.map((item: any) => (
            <PaginationItem {...item} />
          ))}
        </PaginationContainer>
      </Pagination>
    ));
  },
};

export const WithColorSchemes: Story = {
  args: {
    colorSchemes: ["green", "red", "blue"],
  },
  render: function CustomRenderer({ colorSchemes }) {
    const { items } = usePagination({ count: 8 });
    return colorSchemes.map((colorScheme: string) => (
      <Pagination colorScheme={colorScheme} key={colorScheme} mb="4">
        <PaginationContainer>
          {items.map((item: any) => (
            <PaginationItem {...item} />
          ))}
        </PaginationContainer>
      </Pagination>
    ));
  },
};
