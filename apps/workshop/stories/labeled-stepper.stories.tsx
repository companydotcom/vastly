import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import {
  LabeledStepper,
  LabeledStepperStep,
  LabeledStepperCompleted,
  usePrev,
  useNext,
  Container,
  Box,
  Button,
  ButtonProps,
  Stack,
  ButtonGroup,
  Spacer,
} from "@companydotcom/ui"

const meta: Meta<typeof LabeledStepper> = {
  component: LabeledStepper,
  title: "Components/Stepper/Labeled",
  decorators: [
    (Story) => (
      <Container>
        <Story />
      </Container>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof LabeledStepper>

const Template = function CustomerRenderer({ step, steps }: any) {
  return (
    <>
      <LabeledStepper step={step}>
        {steps.map((args: any, i: any) => (
          <LabeledStepperStep key={i} {...args} />
        ))}

        <LabeledStepperCompleted>Completed</LabeledStepperCompleted>
      </LabeledStepper>
    </>
  )
}

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
  render: Template,
}
