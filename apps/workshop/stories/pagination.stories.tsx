import type { Meta, StoryObj } from "@storybook/react"
import { Pagination } from "@dxp/ui"

const meta: Meta<typeof Pagination> = {
  component: Pagination,
}

export default meta
type Story = StoryObj<typeof Pagination>

export const Primary: Story = {
  render: () => <Pagination primary label="Button" />,
}
