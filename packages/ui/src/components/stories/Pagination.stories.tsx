import type { Meta, StoryObj } from "@storybook/react";
import { Pagination, PaginationContainer, PaginationItem, PaginationProps } from '../pagination';
import { usePagination } from '../../hooks/index'

const meta: Meta<typeof Pagination> = {
  component: Pagination,
  title: "Components/Pagination",
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
      table: {
        defaultValue: {summary: "md"},
        description:{summary: "The size of the pagination component."},
        type: {summary: "string"}
      }
    },
    page: {
      control: "number",
      table: {
        type: {summary: "number"},
        defaultValue: {summary: 8}
      }
    },
    isDisabled: {
      control: "boolean",
      table: {
        type: { summary: "boolean"},
        defaultValue: { summary: false},
      }
    }
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;


export const Usage: Story = {
  render: ({page, size, isDisabled, boundaryCount, siblingCount, onChange, variant, colorScheme, ...args}: any) => {
  const { items } = usePagination({ count: page || 8 });
  return (
      <Pagination size={size} variant={variant} colorScheme={colorScheme}>
        <PaginationContainer>
          {items.map((item: any) => (
            <PaginationItem {...item} isDisabled={isDisabled}/>
          ))}
        </PaginationContainer>
      </Pagination>
    )}}

/** Use the `size` prop to change the size of the button. You can set the value to `xs`, `sm`, `md`, or `lg`. */
export const WithSizes: Story = {
  args: {
    sizes: ["xs", "sm", "md", "lg"],
  },
  parameters: {
    controls: {
      exclude: /^_|as|html|size/,
    }
  },

  render: ({ sizes, page, isDisabled }: any) => {
    const { items } = usePagination({ count: page || 8 });
    return sizes.map((s: string) => (
      <Pagination size={s} key={s} mb="4">
        <PaginationContainer>
          {items.map((item: any) => (
            <PaginationItem {...item} isDisabled={isDisabled}/>
          ))}
        </PaginationContainer>
      </Pagination>
    ));
  },
};
 /** Use the `variant` prop to change the visual style of the Button. You can set the value to `solid`, `ghost`, `outline`, or `unstyled`. */
export const WithVariants: Story = {
  args: {
    variant: ["solid", "ghost", "outline", "unstyled", ],
  },
  render: ({ variant, size }: any) => {
    const { items } = usePagination({ count: 8 });
    return variant.map((v: string) => (
      <Pagination size={size} key={v} mb="4" variant={v}>
        <PaginationContainer>
          {items.map((item: any) => (
            <PaginationItem {...item} />
          ))}
        </PaginationContainer>
      </Pagination>
    ));
  },
};

/**Use the `colorScheme` prop to change the color scheme of the Button. You can set the value to any of the color scales from your design system, like `whiteAlpha`, `blackAlpha`, `gray`, `red`, `blue`, or your custom color scale. */
export const PaginationColors: Story = {
  args: {
    colorSchemes: ["cyan", "pink", "orange"],
  },
  render: ({ colorSchemes }: any) => {
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

/** Use the `boundaryCount` prop to adjust the spacing between the ellipsis and the end of the pagination count. Use the `siblingCount` prop to adjust the spacing between the beginning of the pagination count and the ellipsis. See `usePagination` under `Hooks` */
export const AdjustBoundariesAndSiblings: Story = {
  args: {
    boundaryCount: 1,
    siblingCount: 1
  },

  render: ({ boundaryCount, page, siblingCount }: any) => {
    const props = usePagination({ count: page || 8, boundaryCount, siblingCount });
      return(
      <Pagination  mb="4">
        <PaginationContainer>
        {props.items.map((item: any) => (
            <PaginationItem {...item} />
            ))}
        </PaginationContainer>
      </Pagination>
      )
  },
};
