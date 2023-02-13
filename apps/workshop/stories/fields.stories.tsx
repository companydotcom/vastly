import type { Meta, StoryObj } from "@storybook/react"
import { Field, Form } from "@dxp/forms"

const meta: Meta<typeof Field> = {
  component: Field,
  title: "Forms/Field",
  decorators: [
    (Story) => (
      <Form onSubmit={() => {}}>
        <Story />
      </Form>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Field>

export const Basic: Story = {
  args: { type: "text", name: "test", label: "Text input" },
}
