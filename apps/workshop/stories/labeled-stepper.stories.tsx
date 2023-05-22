import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
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
} from "@vastly/ui";

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
};

export default meta;
type Story = StoryObj<typeof LabeledStepper>;

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
  );
};

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
      {
        title: "Fourth step",
      },
      {
        title: "Fifth step",
      },
    ],
  },
  render: Template,
};

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
};

const NextButton = (props: ButtonProps) => {
  const { label, onClick } = useNext({ label: "Next", submitLabel: "Complete" });
  return (
    <Button onClick={onClick} {...props}>
      {label}
    </Button>
  );
};

const PrevButton = (props: ButtonProps) => {
  const { label, onClick, isDisabled } = usePrev();
  return (
    <Button variant="ghost" onClick={onClick} isDisabled={isDisabled} {...props}>
      {label}
    </Button>
  );
};

const ControlledStep = ({ children }: React.PropsWithChildren) => {
  return (
    <Stack>
      <Box py="4">{children}</Box>

      <ButtonGroup>
        <NextButton />
        <PrevButton />
      </ButtonGroup>
    </Stack>
  );
};

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
  ];

  return (
    <>
      <LabeledStepper orientation="vertical">
        {steps.map((args, i) => (
          <LabeledStepperStep key={i} {...args} />
        ))}
        <LabeledStepperCompleted>Completed</LabeledStepperCompleted>
      </LabeledStepper>
    </>
  );
};
