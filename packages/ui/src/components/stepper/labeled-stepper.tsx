import * as React from "react"

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
} from "@chakra-ui/react"
// import { CheckIcon, Icon } from "@chakra-ui/icons"
import { cx, dataAttr, isDev } from "@companydotcom/utils"
import { getChildOfType, getChildrenOfType } from "../../utils"
// TODO: Remove the workaround whenever MS fixes the issue
// https://github.com/microsoft/TypeScript/issues/48212
import type { ComponentWithAs } from "@chakra-ui/react"

import {
  StepperProvider,
  useStepper,
  useStep,
  useStepperContext,
  UseStepperProps,
} from "./use-stepper"

const [StylesProvider, useStyles] = createStylesContext("LabeledStepper")

export interface LabeledStepperProps
  extends UseStepperProps,
    Omit<HTMLChakraProps<"div">, "onChange">,
    ThemingProps<"Stepper"> {}

/**
 * Display progress with labels in multi-step workflows.
 *
 * Can be controlled or uncontrolled.
 */
export const LabeledStepper = forwardRef<LabeledStepperProps, "div">((props, ref) => {
  const { children, ...containerProps } = props
  return (
    <LabeledStepperContainer ref={ref} {...containerProps}>
      <LabeledStepperSteps>{children}</LabeledStepperSteps>
    </LabeledStepperContainer>
  )
})

if (isDev()) {
  LabeledStepper.displayName = "LabeledStepper"
}

export const LabeledStepperContainer = forwardRef<LabeledStepperProps, "div">((props, ref) => {
  const { children, step, onChange, ...rest } = props

  const styles = useMultiStyleConfig("LabeledStepper", {
    ...rest,
  })
  const containerProps = omitThemingProps(rest)

  const context = useStepper(props)

  const containerStyles: SystemStyleObject = {
    display: "flex",
    flexDirection: "column",
    ...styles.container,
  }

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
  )
})

if (isDev()) {
  LabeledStepperContainer.displayName = "LabeledStepperContainer"
}

export interface LabeledStepperStepsProps extends HTMLChakraProps<"div"> {
  stepComponent?: React.JSXElementConstructor<any>
}

/**
 * Wrapper element containing the steps.
 */
export const LabeledStepperSteps = (props: LabeledStepperStepsProps) => {
  const { children, stepComponent, ...rest } = props
  const styles = useStyles()

  const { activeIndex } = useStepperContext()

  const stepperStyles: SystemStyleObject = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    ...styles.steps,
  }

  const Step = stepComponent || LabeledStepperStep

  const steps = getChildrenOfType(children, Step)

  const elements = steps.reduce<React.ReactElement[]>((memo, step, i, arr) => {
    memo.push(
      <Step
        key={i}
        {...step.props}
        icon={step.props.icon || i + 1}
        isActive={activeIndex === i}
        isCompleted={step.props.isCompleted || activeIndex > i}
      />,
    )

    // if (isVertical) {
    //   memo.push(
    //     <StepperContent key={`content-${i}`} isOpen={activeIndex === i}>
    //       {step.props.children}
    //     </StepperContent>,
    //   )
    // }

    // if (i < arr.length - 1) {
    //   memo.push(<StepperSeparator key={`separator-${i}`} isActive={i < activeIndex} />)
    // }

    return memo
  }, [])

  const completed = getChildOfType(children, LabeledStepperCompleted)

  const content =
    activeIndex >= steps.length ? (
      completed
    ) : (
      <LabeledStepperContent>{steps[activeIndex]?.props?.children}</LabeledStepperContent>
    )

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
  )
}

if (isDev()) {
  LabeledStepperSteps.displayName = "LabeledStepperSteps"
}

/**
 * Shown when all steps have completed.
 */
export const LabeledStepperCompleted: React.FC<HTMLChakraProps<"div">> = (props) => {
  const styles = useStyles()
  return (
    <chakra.div
      __css={styles.completed}
      {...props}
      className={cx("dxp-ui-stepper__completed", props.className)}
    />
  )
}

if (isDev()) {
  LabeledStepperCompleted.displayName = "LabeledStepperCompleted"
}

export interface LabeledStepperContentProps extends HTMLChakraProps<"div"> {
  /**
   * Show or hide the content
   */
  isOpen?: boolean
}

/**
 * Renders the step content, is collapsible.
 */
export const LabeledStepperContent = (props: LabeledStepperContentProps) => {
  const { children, isOpen = true, ...rest } = props
  const styles = useStyles()

  return (
    <chakra.div
      __css={styles.content}
      {...rest}
      className={cx("dxp-ui-stepper__content", props.className)}
    >
      <Collapse in={isOpen}>{children}</Collapse>
    </chakra.div>
  )
}

if (isDev()) {
  LabeledStepperContent.displayName = "LabeledStepperContent"
}

export interface LabeledStepperStepProps extends Omit<HTMLChakraProps<"div">, "title"> {
  /**
   * The step title
   */
  title: React.ReactNode
  /**
   * The step name, used for controlled steppers
   */
  name?: string
  /**
   * Show an icon instead of the step number
   */
  icon?: React.ReactNode
  /**
   *
   */
  isActive?: boolean
  /**
   *
   */
  isCompleted?: boolean
}

/**
 * Displays the icon and step title.
 */
export const LabeledStepperStep = (props: LabeledStepperStepProps) => {
  const { name, title, icon, isActive, isCompleted, ...rest } = props
  const step = useStep(props)
  const styles = useStyles()

  const stepStyles: SystemStyleObject = {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    ...styles.step,
  }

  return (
    <chakra.div
      {...rest}
      __css={stepStyles}
      data-active={dataAttr(step.isActive)}
      data-completed={dataAttr(step.isCompleted)}
      className={cx("dxp-ui-stepper__step", props.className)}
    >
      {title && <LabeledStepperStepTitle>{title}</LabeledStepperStepTitle>}
      <LabeledStepperSeparator isActive={step?.isActive} />
    </chakra.div>
  )
}

if (isDev()) {
  LabeledStepperStep.displayName = "LabeledStepperStep"
}

export interface LabeledStepperSeparatorProps extends HTMLChakraProps<"div"> {
  isActive?: boolean
}

/**
 * The bar above a labeled step.
 */
export const LabeledStepperSeparator = (props: LabeledStepperSeparatorProps) => {
  const { isActive, ...rest } = props
  const styles = useStyles()

  const separatorStyles: SystemStyleObject = {
    ...styles.separator,
  }

  return (
    <chakra.div
      {...rest}
      data-active={dataAttr(isActive)}
      className={cx("dxp-ui-stepper__separator", props.className)}
      __css={separatorStyles}
    />
  )
}

if (isDev()) {
  LabeledStepperSeparator.displayName = "LabeledStepperSeparator"
}

/**
 * The step title.
 */
export const LabeledStepperStepTitle: React.FC<HTMLChakraProps<"p">> = (props) => {
  const styles = useStyles()
  return (
    <chakra.p
      {...props}
      __css={styles.title}
      className={cx("dxp-ui-stepper__title", props.className)}
    />
  )
}

if (isDev()) {
  LabeledStepperStepTitle.displayName = "LabeledStepperStepTitle"
}
