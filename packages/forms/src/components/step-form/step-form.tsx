import * as React from "react"

import { FieldValues } from "react-hook-form"
import { chakra, Button, ButtonProps, HTMLChakraProps, ThemingProps } from "@chakra-ui/react"
import { callAllHandlers, runIfFn, cx, isDev } from "@companydotcom/utils"
import {
  StepperProvider,
  NumberStepperSteps,
  NumberStepperStepsProps,
  NumberStepperStep,
  useStepperContext,
  NumberStepperContainer,
} from "@companydotcom/ui"
import { Form } from "../form"
import { SubmitButton } from "../submit-button"

import {
  useStepForm,
  useFormStep,
  StepFormProvider,
  UseStepFormProps,
  FormStepSubmitHandler,
} from "./use-step-form"

export interface StepFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TContext extends object = object,
> extends UseStepFormProps<TFieldValues> {}

// eslint-disable-next-line react/display-name
export const StepForm = React.forwardRef(
  <TFieldValues extends FieldValues = FieldValues, TContext extends object = object>(
    props: StepFormProps<TFieldValues, TContext>,
    ref: React.ForwardedRef<HTMLFormElement>,
  ) => {
    const { children, ...rest } = props

    const stepper = useStepForm<TFieldValues>(props)

    const { getFormProps, ...ctx } = stepper

    const context = React.useMemo(() => ctx, [ctx])

    return (
      <StepperProvider value={context}>
        <StepFormProvider value={context}>
          <Form ref={ref} {...rest} {...getFormProps()}>
            {runIfFn(children, stepper)}
          </Form>
        </StepFormProvider>
      </StepperProvider>
    )
  },
) as <TFieldValues extends FieldValues>(
  props: StepFormProps<TFieldValues> & {
    ref?: React.ForwardedRef<HTMLFormElement>
  },
) => React.ReactElement

export interface FormStepOptions {
  /**
   * The step name
   */
  name: string
  /**
   * Schema
   */
  schema?: any
  /**
   * Hook Form Resolver
   */
  resolver?: any
}

export interface FormStepperProps extends NumberStepperStepsProps, ThemingProps<"Stepper"> {}

export const FormStepper: React.FC<FormStepperProps> = (props) => {
  const { activeIndex, setIndex } = useStepperContext()

  const { children, orientation, variant, colorScheme, size, ...rest } = props

  const elements = React.Children.map(children, (child) => {
    if (React.isValidElement<FormStepProps>(child) && child?.type === FormStep) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { isCompleted } = useFormStep(child.props) // Register this step
      return (
        <NumberStepperStep
          name={child.props.name}
          title={child.props.title}
          isCompleted={isCompleted}
          {...rest}
        >
          {child.props.children}
        </NumberStepperStep>
      )
    }
    return child
  })

  const onChange = React.useCallback((i: number) => {
    setIndex(i)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <NumberStepperContainer
      orientation={orientation}
      step={activeIndex}
      variant={variant}
      colorScheme={colorScheme}
      size={size}
      onChange={onChange}
    >
      <NumberStepperSteps mb="4" {...props}>
        {elements}
      </NumberStepperSteps>
    </NumberStepperContainer>
  )
}

export interface FormStepProps extends FormStepOptions, Omit<HTMLChakraProps<"div">, "onSubmit"> {
  onSubmit?: FormStepSubmitHandler
}

export const FormStep: React.FC<FormStepProps> = (props) => {
  const { name, schema, resolver, children, className, onSubmit, ...rest } = props
  const step = useFormStep({ name, schema, resolver, onSubmit })

  const { isActive } = step

  return isActive ? (
    <chakra.div {...rest} className={cx("dxp-ui-form__step", className)}>
      {children}
    </chakra.div>
  ) : null
}

if (isDev()) {
  FormStep.displayName = "FormStep"
}

export const PrevButton: React.FC<ButtonProps> = (props) => {
  const { isFirstStep, isCompleted, prevStep } = useStepperContext()

  return (
    <Button
      isDisabled={isFirstStep || isCompleted}
      label="Back"
      {...props}
      className={cx("sui-form__prev-button", props.className)}
      onClick={callAllHandlers(props.onClick, prevStep)}
    />
  )
}

if (isDev()) {
  PrevButton.displayName = "PrevButton"
}

export interface NextButtonProps extends Omit<ButtonProps, "children"> {
  submitLabel?: string
  label?: string
}

export const NextButton: React.FC<NextButtonProps> = (props) => {
  const { label = "Next", submitLabel = "Complete", ...rest } = props
  const { isLastStep, isCompleted } = useStepperContext()

  return (
    <SubmitButton
      {...rest}
      isDisabled={isCompleted}
      className={cx("sui-form__next-button", props.className)}
    >
      {isLastStep || isCompleted ? submitLabel : label}
    </SubmitButton>
  )
}

if (isDev()) {
  NextButton.displayName = "NextButton"
}
