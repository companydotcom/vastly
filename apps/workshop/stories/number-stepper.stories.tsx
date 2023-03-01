import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import {
  NumberStepper,
  NumberStepperStep,
  NumberStepperCompleted,
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

const meta: Meta<typeof NumberStepper> = {
  component: NumberStepper,
  title: "Components/Stepper/Number",
  decorators: [
    (Story) => (
      <Container>
        <Story />
      </Container>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof NumberStepper>

const Template = function CustomerRenderer({ step, steps, orientation = "horizontal" }: any) {
  return (
    <>
      <NumberStepper step={step} orientation={orientation}>
        {steps.map((args: any, i: any) => (
          <NumberStepperStep key={i} {...args} />
        ))}

        <NumberStepperCompleted>Completed</NumberStepperCompleted>
      </NumberStepper>
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

export const WithContent: Story = {
  args: {
    steps: [
      {
        title: "First step",
        children: (
          <>
            <Box width="full" bg="red.200" height="10" />
          </>
        ),
      },
      {
        title: "Second step",
        children: (
          <>
            <Box width="full" bg="green.200" height="10" />
          </>
        ),
      },
      {
        title: "Third step",
        children: (
          <>
            <Box width="full" bg="yellow.200" height="10" />
          </>
        ),
      },
    ],
  },
  render: Template,
}

export const WithVerticalOrientation: Story = {
  args: {
    orientation: "vertical",
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

const NextButton = (props: ButtonProps) => {
  const { label, onClick } = useNext({ label: "Next", submitLabel: "Complete" })
  return (
    <Button onClick={onClick} {...props}>
      {label}
    </Button>
  )
}

const PrevButton = (props: ButtonProps) => {
  const { label, onClick, isDisabled } = usePrev()
  return (
    <Button variant="ghost" onClick={onClick} isDisabled={isDisabled} {...props}>
      {label}
    </Button>
  )
}

const ControlledStep = ({ children }: React.PropsWithChildren) => {
  return (
    <Stack>
      <Box py="4">{children}</Box>

      <ButtonGroup>
        <NextButton />
        <PrevButton />
      </ButtonGroup>
    </Stack>
  )
}

export const Controlled = () => {
  const steps = [
    {
      name: "step 1",
      title: "First step",
      children: <ControlledStep>Content step 1</ControlledStep>,
    },
    {
      name: "step 2",
      title: "Second step",
      children: <ControlledStep>Content step 2</ControlledStep>,
    },
    {
      name: "step 3",
      title: "Third step",
      children: <ControlledStep>Content step 3</ControlledStep>,
    },
  ]

  return (
    <>
      <NumberStepper orientation="vertical">
        {steps.map((args, i) => (
          <NumberStepperStep key={i} {...args} />
        ))}
        <NumberStepperCompleted>Completed</NumberStepperCompleted>
      </NumberStepper>
    </>
  )
}

export const UnControlled = () => {
  const [step, setStep] = React.useState(0)

  const back = () => {
    setStep(step - 1)
  }

  const next = () => {
    setStep(step + 1)
  }

  const steps = [
    {
      name: "step 1",
      title: "First step",
      children: <Box py="4">Content step 1</Box>,
    },
    {
      name: "step 2",
      title: "Second step",
      children: <Box py="4">Content step 2</Box>,
    },
    {
      name: "step 3",
      title: "Third step",
      children: <Box py="4">Content step 3</Box>,
    },
  ]

  return (
    <>
      <NumberStepper step={step} mb="2">
        {steps.map((args, i) => (
          <NumberStepperStep key={i} {...args} />
        ))}
        <NumberStepperCompleted py="4">Completed</NumberStepperCompleted>
      </NumberStepper>
      <ButtonGroup width="100%">
        <Button onClick={back} isDisabled={step === 0} variant="ghost">
          Back
        </Button>
        <Spacer />
        <Button onClick={next} isDisabled={step >= 3}>
          Next
        </Button>
      </ButtonGroup>
    </>
  )
}
