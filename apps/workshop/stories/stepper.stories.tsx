import type { Meta, StoryObj } from "@storybook/react"
import {
  Stepper,
  StepperProps,
  StepperSteps,
  StepperStep,
  StepperStepProps,
  StepperCompleted,
  usePrev,
  useNext,
  Container,
} from "@companydotcom/ui"

const meta: Meta<typeof Stepper> = {
  component: Stepper,
  title: "Components/Stepper",
  decorators: [
    (Story) => (
      <Container>
        <Story />
      </Container>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Stepper>

export const Basic: Story = {
  args: {
    step: 1,
    steps: [
      {
        title: "First step",
      },
      {
        title: "Second step",
      },
      {
        title: "Third step",
      },
    ],
  },
  render: function CustomerRenderer({ step, steps }) {
    return (
      <>
        <Stepper step={step} orientation="horizontal">
          {/* <StepperSteps> */}
          {steps.map((args: any, i: any) => (
            <StepperStep key={i} {...args} />
          ))}
          {/* </StepperSteps> */}
          <StepperCompleted>Completed</StepperCompleted>
        </Stepper>
      </>
    )
  },
}
