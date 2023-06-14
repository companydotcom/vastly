import * as React from "react";

import {
  chakra,
  forwardRef,
  useMultiStyleConfig,
  HTMLChakraProps,
  ThemingProps,
  omitThemingProps,
  SystemStyleObject,
  createStylesContext,
  Collapse,
} from "@chakra-ui/react";
// import { CheckIcon, Icon } from "@chakra-ui/icons"
import { cx, dataAttr, isDev } from "@vastly/utils";
import { getChildOfType, getChildrenOfType } from "../../utils";
// TODO: Remove the workaround whenever MS fixes the issue
// https://github.com/microsoft/TypeScript/issues/48212
import type { ComponentWithAs } from "@chakra-ui/react";

import {
  StepperProvider,
  useStepper,
  useStep,
  useStepperContext,
  UseStepperProps,
} from "./use-stepper";

const [StylesProvider, useStyles] = createStylesContext("NumberStepper");

export interface NumberStepperProps
  extends UseStepperProps,
    Omit<HTMLChakraProps<"div">, "onChange">,
    ThemingProps<"Stepper"> {
  orientation?: "horizontal" | "vertical";
}

/**
 * Display progress with numbers in multi-step workflows.
 * Can be controlled or uncontrolled.
 *
 */
export const NumberStepper = forwardRef<NumberStepperProps, "div">((props, ref) => {
  const { orientation, children, ...containerProps } = props;
  return (
    <NumberStepperContainer ref={ref} orientation={orientation} {...containerProps}>
      <NumberStepperSteps orientation={orientation}>{children}</NumberStepperSteps>
    </NumberStepperContainer>
  );
});

if (isDev()) {
  NumberStepper.displayName = "NumberStepper";
}

export const NumberStepperContainer = forwardRef<NumberStepperProps, "div">((props, ref) => {
  const { children, orientation = "horizontal", step, onChange, ...rest } = props;

  const styles = useMultiStyleConfig("NumberStepper", {
    ...rest,
    orientation,
  });
  const containerProps = omitThemingProps(rest);

  const context = useStepper(props);

  const containerStyles: SystemStyleObject = {
    display: "flex",
    flexDirection: "column",
    ...styles.container,
  };

  return (
    <StylesProvider value={styles}>
      <StepperProvider value={context}>
        <chakra.div
          ref={ref}
          __css={containerStyles}
          {...containerProps}
          className={cx("dxp-ui-numberstepper", props.className)}
        >
          {children}
        </chakra.div>
      </StepperProvider>
    </StylesProvider>
  );
});

if (isDev()) {
  NumberStepperContainer.displayName = "NumberStepperContainer";
}

export interface NumberStepperStepsProps extends HTMLChakraProps<"div"> {
  orientation?: "horizontal" | "vertical";
  stepComponent?: React.JSXElementConstructor<any>;
}

/**
 * Wrapper element containing the steps.
 */
export const NumberStepperSteps = (props: NumberStepperStepsProps) => {
  const { children, orientation = "horizontal", stepComponent, ...rest } = props;
  const styles = useStyles();

  const { activeIndex } = useStepperContext();

  const stepperStyles: SystemStyleObject = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    ...styles.steps,
  };

  const isVertical = orientation === "vertical";

  const Step = stepComponent || NumberStepperStep;

  const steps = getChildrenOfType(children, Step);

  const elements = steps.reduce<React.ReactElement[]>((memo, step, i, arr) => {
    memo.push(
      <Step
        key={i}
        {...step.props}
        icon={step.props.icon || i + 1}
        isActive={activeIndex === i}
        isCompleted={step.props.isCompleted || activeIndex > i}
      />,
    );

    if (isVertical) {
      memo.push(
        <NumberStepperContent key={`content-${i}`} isOpen={activeIndex === i}>
          {step.props.children}
        </NumberStepperContent>,
      );
    }

    if (i < arr.length - 1) {
      memo.push(<NumberStepperSeparator key={`separator-${i}`} isActive={i < activeIndex} />);
    }

    return memo;
  }, []);

  const completed = getChildOfType(children, NumberStepperCompleted);

  const content =
    activeIndex >= steps.length ? (
      completed
    ) : !isVertical ? (
      <NumberStepperContent>{steps[activeIndex]?.props?.children}</NumberStepperContent>
    ) : null;

  return (
    <>
      <chakra.div
        __css={stepperStyles}
        {...rest}
        className={cx("dxp-ui-stepper__steps", props.className)}
      >
        {elements}
      </chakra.div>
      {content}
    </>
  );
};

if (isDev()) {
  NumberStepperSteps.displayName = "NumberStepperSteps";
}

export interface NumberStepperContentProps extends HTMLChakraProps<"div"> {
  /**
   * Show or hide the content
   */
  isOpen?: boolean;
}

/**
 * Renders the step content, is collapsible.
 */
export const NumberStepperContent = (props: NumberStepperContentProps) => {
  const { children, isOpen = true, ...rest } = props;
  const styles = useStyles();

  return (
    <chakra.div
      __css={styles.content}
      {...rest}
      className={cx("dxp-ui-stepper__content", props.className)}
    >
      <Collapse in={isOpen}>{children}</Collapse>
    </chakra.div>
  );
};

if (isDev()) {
  NumberStepperContent.displayName = "NumberStepperContent";
}

export interface StepperIconProps extends HTMLChakraProps<"div"> {
  icon: React.ReactNode;
  isActive?: boolean;
  isCompleted?: boolean;
}

/**
 * Displays the current step or a completed icon.
 */
export const NumberStepperIcon = (props: StepperIconProps) => {
  const { icon, isActive, isCompleted, className, ...rest } = props;

  const styles = useStyles();

  const iconStyles: SystemStyleObject = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "full",
    fontSize: "1em",
    ...styles.icon,
  };

  let content;
  // if (isCompleted) {
  //   content = <Icon as={CheckIcon} />
  // } else {
  content = icon;
  // }

  return (
    <chakra.div __css={iconStyles} {...rest} className={cx("dxp-ui-stepper__icon", className)}>
      {content}
    </chakra.div>
  );
};

if (isDev()) {
  NumberStepperIcon.displayName = "NumberStepperIcon";
}

export interface NumberStepperStepProps extends Omit<HTMLChakraProps<"div">, "title"> {
  /**
   * The step title
   */
  title: React.ReactNode;
  /**
   * The step name, used for controlled steppers
   */
  name?: string;
  /**
   * Show an icon instead of the step number
   */
  icon?: React.ReactNode;
  /**
   *
   */
  isActive?: boolean;
  /**
   *
   */
  isCompleted?: boolean;
}

/**
 * Displays the icon and step title.
 */
export const NumberStepperStep = (props: NumberStepperStepProps) => {
  const { name, title, icon, isActive, isCompleted, ...rest } = props;
  const step = useStep(props);
  const styles = useStyles();

  const stepStyles: SystemStyleObject = {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    ...styles.step,
  };

  return (
    <chakra.div
      {...rest}
      __css={stepStyles}
      data-active={dataAttr(step.isActive)}
      data-completed={dataAttr(step.isCompleted)}
      className={cx("dxp-ui-stepper__step", props.className)}
    >
      <NumberStepperIcon icon={icon} isActive={isActive} isCompleted={isCompleted} />
      {title && <NumberStepperStepTitle>{title}</NumberStepperStepTitle>}
    </chakra.div>
  );
};

if (isDev()) {
  NumberStepperStep.displayName = "NumberStepperStep";
}

export interface NumberStepperSeparatorProps extends HTMLChakraProps<"div"> {
  isActive?: boolean;
}

/**
 * The separator between steps.
 */
export const NumberStepperSeparator = (props: NumberStepperSeparatorProps) => {
  const { isActive, ...rest } = props;
  const styles = useStyles();

  const separatorStyles: SystemStyleObject = {
    flex: 1,
    mx: 2,
    ...styles.separator,
  };

  return (
    <chakra.div
      {...rest}
      data-active={dataAttr(isActive)}
      className={cx("dxp-ui-stepper__separator", props.className)}
      __css={separatorStyles}
    />
  );
};

if (isDev()) {
  NumberStepperSeparator.displayName = "NumberStepperSeparator";
}

/**
 * The step title.
 */
export const NumberStepperStepTitle: React.FC<HTMLChakraProps<"p">> = (props) => {
  const styles = useStyles();
  return (
    <chakra.p
      {...props}
      __css={styles.title}
      className={cx("dxp-ui-stepper__title", props.className)}
    />
  );
};

if (isDev()) {
  NumberStepperStepTitle.displayName = "NumberStepperStepTitle";
}

/**
 * Shown when all steps have completed.
 */
export const NumberStepperCompleted: React.FC<HTMLChakraProps<"div">> = (props) => {
  const styles = useStyles();
  return (
    <chakra.div
      __css={styles.completed}
      {...props}
      className={cx("dxp-ui-stepper__completed", props.className)}
    />
  );
};

if (isDev()) {
  NumberStepperCompleted.displayName = "NumberStepperCompleted";
}
