import React from 'react';
import type { Meta, StoryObj } from "@storybook/react";
import { Form, Field, StepForm, FormLayout, FormStep, NextButton } from "../src";

const meta: Meta<typeof Form> = {
  component: Form,
  title: "Components/Step Form",
  argTypes: {
    onSubmit: {
      description: "`(data: TFieldValues, event?: React.BaseSyntheticEvent) => any | Promise<any>`",
    },
    defaultValues: {
      description: "Takes an object to pass data down to the `Field` component\n\n Example: `{name: 'Custom Offering', email: '', password: ''}`",
    }
  }
};

export default meta;
type Story = StoryObj<typeof Form>;

/**The `StepForm` component creates a `Form` component with multiple steps. Use the `onSubmit` prop to grab data and process it
 *
 *```jsx
 * //StepForm example
 *
 * import { Form, Field, StepForm, FormLayout, FormStep, NextButton } from "@vastly/forms";
 *
 * function Example() => {
 *   const defaultValues = {
 *     name: "Custom offering",
 *     email: "",
 *     password: "",
 *   };
 *   const onSubmit = (params: typeof defaultValues) => {
 *     console.log(params);
 *     return new Promise((resolve) => {
 *       setTimeout(resolve, 1000);
 *     });
 *   };
 *   return (
 *     <StepForm defaultValues={defaultValues} onSubmit={onSubmit}>
 *       <FormLayout>
 *         <FormStep name="profile">
 *           <FormLayout>
 *             <Field name="name" label="Name" rules={{ required: true }} />
 *             <Field name="email" label="Email" rules={{ required: true }} />
 *             <NextButton />
 *           </FormLayout>
 *         </FormStep>
 *         <FormStep name="password">
 *           <FormLayout>
 *             <Field name="password" label="Password" type="password" rules={{ required: true, minLength: *4 }} />
 *             <NextButton />
 *           </FormLayout>
 *         </FormStep>
 *       </FormLayout>
 *     </StepForm>
 *   );
 * },
 * ```
*/
export const Basic: Story = {
  render: () => {
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
              <Field name="password" label="Password" type="password" rules={{ required: true, minLength: 4 }} />
              <NextButton />
            </FormLayout>
          </FormStep>
        </FormLayout>
      </StepForm>
    );
  },
};
