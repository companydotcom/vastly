import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Container, ButtonProps, Button, Stack, ButtonGroup, Spacer, Box } from '@chakra-ui/react';
import { NumberStepper, NumberStepperStep, NumberStepperCompleted, useNext, usePrev, useStep, useStepper,} from '../stepper';

const meta: Meta<typeof NumberStepper> = {
  component: NumberStepper,
  title: "Components/Stepper/Number Stepper",
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
type Story = StoryObj<typeof NumberStepper>;

const Template = ({ steps, orientation = "horizontal", size }: any) => {
  const [step, setStep] = React.useState(0);

  const back = () => {
    setStep(step - 1);
  };

  const next = () => {
    setStep(step + 1);
  };
  return (
    <Box>
      <NumberStepper step={step} orientation={orientation} size={size}>
        {steps.map((args: any, i: any) => (
          <NumberStepperStep key={i} {...args} />
        ))}

        <NumberStepperCompleted>Completed</NumberStepperCompleted>
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
    ],
  },
  render: Template,
};

/** An uncontrolled `NumberStepper` uses `React.useState` to maintain and update its current state, or current step */
export const Uncontrolled = () => {
  const [step, setStep] = React.useState(0);

  const back = () => {
    setStep(step - 1);
  };

  const next = () => {
    setStep(step + 1);
  };

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
  ];

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
  );
};

/** A controlled NumberStepper uses other components to manage its state. This is an example:
 *
 * ```jsx
 * const NextButton = (props: ButtonProps) => {
 *   const { label, onClick } = useNext({ label: "Next", submitLabel: "Complete" });
 *   return (
 *      <Button onClick={onClick} {...props}>
 *        {label}
 *      </Button>
 *    );
 *  };
*
*const PrevButton = (props: ButtonProps) => {
*  const { label, onClick, isDisabled } = usePrev();
*  return (
*    <Button variant="ghost" onClick={onClick} isDisabled={isDisabled} {...props}>
*      {label}
*    </Button>
*  );
*};
*
*const ControlledStep = ({ children }: React.PropsWithChildren) => {
*  return (
*    <Stack>
*      <Box py="4">{children}</Box>
*      <ButtonGroup>
*        <NextButton />
*        <PrevButton />
*      </ButtonGroup>
*    </Stack>
*  );
*};
```
 */
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
    <Box>
      <NumberStepper>
        {steps.map((args, i) => (
          <NumberStepperStep key={i} {...args} />
        ))}
        <NumberStepperCompleted>Completed</NumberStepperCompleted>
      </NumberStepper>
    </Box>
  );
};


/** To change the size of the step indicator, you can pass the `size` prop to the `NumberStepper` component, setting it to either md or lg.

 */
export const WithSizes: Story = {
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
    sizes: ["md", "lg"]
  },
  render: ({ steps, orientation = "horizontal", sizes }: any) => {
    const [step, setStep] = React.useState(0);

    const back = () => {
      setStep(step - 1);
    };

    const next = () => {
      setStep(step + 1);
    };
    return (
      <Box>
        {sizes.map((s: string) => (
          <NumberStepper step={step} orientation={orientation} size={s}>
          {steps.map((args: any, i: any) => (
            <NumberStepperStep key={i} {...args} />
          ))}
          <NumberStepperCompleted>Completed</NumberStepperCompleted>
        </NumberStepper>
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
          <NumberStepper step={step} orientation={orientation} colorScheme={c}>
          {steps.map((args: any, i: any) => (
            <NumberStepperStep key={i} {...args} />
          ))}
          <NumberStepperCompleted>Completed</NumberStepperCompleted>
        </NumberStepper>
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

/** Changing the orientation. */
export const WithVerticalOrientation: Story = {
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
    orientation: "vertical"
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



