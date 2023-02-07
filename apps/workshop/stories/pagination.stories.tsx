import type { Meta, StoryObj } from "@storybook/react"
import { Pagination, usePagination, PaginationContainer, PaginationItem } from "@dxp/ui"

const meta: Meta<typeof Pagination> = {
  component: Pagination,
}

export default meta
type Story = StoryObj<typeof Pagination>

export const Primary: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { items } = usePagination({ count: 8 })
    return (
      <Pagination>
        <PaginationContainer>
          {items.map((item) => (
            <PaginationItem {...item} />
          ))}
        </PaginationContainer>
      </Pagination>
    )
  },
}
