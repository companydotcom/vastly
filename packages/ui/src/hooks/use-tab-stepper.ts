import React from "react";
import { warn, error, isBrowser } from "../utils";

export interface Steps {
  slug?: string;
  label?: string;
  component?: JSX.Element;
  url?: string;
}

export interface UseTabStepperProps {
  steps: Steps[];
  /** Steps the initial step of the stepper.  @default 0 */
  initialStep?: number | string;
  /** Scrolls the user to the top of the browser window on every step change.  @default true */
  scrollOnStepChange?: boolean;
}

export function useTabStepper(props: UseTabStepperProps) {
  const { steps = [], initialStep = 0, scrollOnStepChange = true } = props;

  const [tabIndex, setTabIndex] = React.useState(
    typeof initialStep === "string"
      ? steps.findIndex((step) => step.slug === initialStep)
      : initialStep,
  );

  React.useCallback(() => {
    if (initialStep) {
      setTabIndex(
        typeof initialStep === "string"
          ? steps.findIndex((step) => step.slug === initialStep)
          : initialStep,
      );
    }
  }, [initialStep, steps]);

  const isFirstStep = tabIndex === 0;
  const isLastStep = tabIndex === steps.length - 1;

  const handleTabsChange = React.useCallback(
    (index: number) => {
      if (isBrowser && scrollOnStepChange) {
        window.scrollTo(0, 0);
      }
      setTabIndex(index);
    },
    [scrollOnStepChange],
  );

  const nextStep = React.useCallback(() => {
    if (isLastStep) {
      return setTabIndex(0);
    }

    const nextStepIndex = tabIndex + 1;
    handleTabsChange(nextStepIndex);
  }, [handleTabsChange, isLastStep, tabIndex]);

  const previousStep = React.useCallback(() => {
    if (isFirstStep) {
      const lastStepIndex = steps.length - 1;
      return handleTabsChange(lastStepIndex);
    }

    const previousStepIndex = tabIndex - 1;
    setTabIndex(previousStepIndex);
  }, [handleTabsChange, isFirstStep, steps.length, tabIndex]);

  const goToStep = React.useCallback(
    (index: number | string) => {
      warn({
        condition: !steps || steps.length === 0,
        message:
          "No steps provided. A steps array must be passed into the hook to goToStep via a slug name",
      });

      if (typeof index === "string" && steps) {
        const step = steps.findIndex((step) => {
          error({
            condition: !step.slug,
            message:
              "slug property not found on the steps array.  You must add a slug to each step",
          });
          return step?.slug === index;
        });
        if (step !== undefined) {
          handleTabsChange(step);
        }
      }

      if (typeof index === "number") {
        handleTabsChange(index);
      }
    },
    [handleTabsChange, steps],
  );

  return {
    tabIndex,
    handleTabsChange,
    nextStep,
    previousStep,
    goToStep,
    isFirstStep,
    isLastStep,
    currentStep: steps[tabIndex],
  };
}

export type UseTabStepperReturn = ReturnType<typeof useTabStepper>;
