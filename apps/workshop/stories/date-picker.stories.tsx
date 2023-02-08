import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { DatePicker } from "@dxp/forms"

const meta: Meta<typeof DatePicker> = {
  component: DatePicker,
  title: "Forms/Date Picker",
}

export default meta
type Story = StoryObj<typeof DatePicker>

export const Basic: Story = {
  render: function CustomRenderer() {
    const [startDate, setStartDate] = useState<Date>()

    return <DatePicker selected={startDate} onChange={(date) => setStartDate(date as Date)} />
  },
}
