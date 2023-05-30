import type { Meta, StoryObj } from "@storybook/react";
import { Form, Field, StepForm, FormLayout, FormStep, NextButton } from "@vastly/forms";

const meta: Meta<typeof Form> = {
  component: Form,
  title: "Forms/StepForm",
};

export default meta;
type Story = StoryObj<typeof Form>;

export const Basic: Story = {
  render: function CustomRenderer() {
    const defaultValues = {
      name: "Custom offering",
      email: "",
      password: "",
    };
    const onSubmit = (params: typeof defaultValues) => {
      console.log(params);
      return new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
    };
    return (
      <StepForm defaultValues={defaultValues} onSubmit={onSubmit}>
        <FormLayout>
          <FormStep name="profile">
            <FormLayout>
              <Field name="name" label="Name" rules={{ required: true }} />
              <Field name="email" label="Email" rules={{ required: true }} />
              <NextButton />
            </FormLayout>
          </FormStep>
          <FormStep name="password">
            <FormLayout>
              <Field name="password" label="Password" rules={{ required: true, minLength: 4 }} />
              <NextButton />
            </FormLayout>
          </FormStep>
        </FormLayout>
      </StepForm>
    );
  },
};
