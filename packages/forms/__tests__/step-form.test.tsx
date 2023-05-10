import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  StepForm,
  FormStepper,
  FormStep,
  PrevButton,
  NextButton,
  SubmitButton,
  Field,
} from "../src";

describe("StepForm", () => {
  it("should render children", () => {
    const onSubmit = vitest.fn();
    const children = <div data-testid="form-children">Form Children</div>;

    const { getByTestId } = render(<StepForm onSubmit={onSubmit}>{children}</StepForm>);
    expect(getByTestId("form-children")).toBeInTheDocument();
  });

  it("should call onSubmit when the form is submitted", async () => {
    const user = userEvent.setup();

    const mock = {
      onSubmit: vitest.fn(),
    };
    const submitSpy = vi.spyOn(mock, "onSubmit");

    const { getByText } = render(
      <StepForm data-testid="form" defaultValues={{ name: "Name" }} onSubmit={mock.onSubmit()}>
        <Field name="name" label="Name" />

        <SubmitButton>Submit</SubmitButton>
      </StepForm>,
    );

    const submitButton = getByText(/submit/i);
    user.click(submitButton);

    expect(submitSpy).toHaveBeenCalled();
  });

  test("should go to the next step", async () => {
    const user = userEvent.setup();
    const mock = {
      onSubmit: vitest.fn(),
    };
    const submitSpy = vi.spyOn(mock, "onSubmit");

    const { getByText, getByLabelText, getByTestId } = render(
      <StepForm onSubmit={mock.onSubmit()}>
        <FormStepper data-testid="form-stepper">
          <FormStep name="step-1" title="Step 1" data-testid="form-step-1">
            <Field name="name" label="Name" />
            <Field name="email" label="Email" />
            <Field name="password" label="Password" />
          </FormStep>
        </FormStepper>
        <PrevButton data-testid="prev-button">Prev</PrevButton>
        <NextButton label="Next" data-testid="next-button" />
      </StepForm>,
    );

    const name = getByLabelText("Name");

    user.type(name, "Test");

    const email = getByLabelText("Email");

    user.type(email, "blahblah@vastly.com");

    const next = getByTestId("next-button");

    user.click(next);

    const password = getByLabelText("Password");

    user.type(password, "Test12345");

    const complete = getByText("Complete");

    user.click(complete);

    expect(submitSpy).toBeCalled();
  });
});
