import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Container, ButtonProps, Button, Stack, ButtonGroup, Box, Spacer } from '@chakra-ui/react';
import { LabeledStepper, LabeledStepperStep, LabeledStepperCompleted, useNext, usePrev } from '../stepper';

const meta: Meta<typeof LabeledStepper> = {
  component: LabeledStepper,
  title: "Components/Steppers/Labeled Stepper",
  argTypes: {
  step: {
    control: "number",
    table: {
      description:{ summary: "Use to switch steps for demo purposes" },
      defaultValue: { summary: 0 },
    }
  },
},
  parameters: {
    controls: {
      exclude: /^_|as|html|steps/,
    }
  }
};

export default meta;
type Story = StoryObj<typeof LabeledStepper>;

const Template = ({ step, steps }: any) => {
  return (
    <Box>
      <LabeledStepper step={step}>
        {steps.map((args: any, i: any) => (
          <LabeledStepperStep key={i} {...args} />
        ))}

        <LabeledStepperCompleted>Completed</LabeledStepperCompleted>
      </LabeledStepper>
    </Box>
  );
};

/** A stepper component is used to indicate progress through a multi-step process. */
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

/** The stepper uses a blue color scheme by default. To change the colorScheme, you can pass the `colorScheme` prop to `NumberStepper` component to any color in the theme. */
export const WithColors: Story = {
  args: {
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
    colors: ["cyan", "pink", "orange"]
  },
  render: ({ steps, orientation = "horizontal", colors }: any) => {
    const [step, setStep] = React.useState(0);

    const back = () => {
      setStep(step - 1);
    };

    const next = () => {
      setStep(step + 1);
    };
    return (
      <Box>
        {colors.map((c: string) => (
          <LabeledStepper step={step} orientation={orientation} colorScheme={c}>
          {steps.map((args: any, i: any) => (
            <LabeledStepperStep key={i} {...args} />
          ))}
          <LabeledStepperCompleted>Completed</LabeledStepperCompleted>
        </LabeledStepper>
        ))}
                      <ButtonGroup width="100%">
        <Button onClick={back} isDisabled={step === 0} variant="ghost">
          Back
        </Button>
        <Spacer />
        <Button onClick={next} isDisabled={step >= 3}>
          Next
        </Button>
      </ButtonGroup>
      </Box>
    );
  },
};

export const WithContent: Story = {
  args: {
    steps: [
      {
        title: "First step",
        children: (
          <Box>
            <Box width="full" bg="red.200" height="10" />
          </Box>
        ),
      },
      {
        title: "Second step",
        children: (
          <Box>
            <Box width="full" bg="green.200" height="10" />
          </Box>
        ),
      },
      {
        title: "Third step",
        children: (
          <Box>
            <Box width="full" bg="yellow.200" height="10" />
          </Box>
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

/** For more information on controlled `LabelStepper`, see `NumberStepper` */
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
