import React from 'react';
import type { Meta, StoryObj } from "@storybook/react";
import { Form, Field, SubmitButton, FormLayout } from "../src";

const meta: Meta<typeof Form> = {
  component: Form,
  title: "Components/Form",
  argTypes: {
    onSubmit: {
      description: "`(data: TFieldValues, event?: React.BaseSyntheticEvent) => any | Promise<any>`",
    },
    defaultValues: {
      description: "Takes an object to pass data down to the `Field` component\n\n Example: `{name: 'Custom Offering', description: ''}`",
    }
  }
};

export default meta;
type Story = StoryObj<typeof Form>;

/** A reusable form component for React. Takes the `Field` components as children
 *
 * ```jsx
 * //Form example
 *
 * import { Form, Field, SubmitButton, FormLayout } from "@vastly/forms";
 *
 *function Example() => {
  *  const defaultValues = {
  *    name: "Custom offering",
  *    description: "",
  *  };
  *  const onSubmit = (params: typeof defaultValues) => {
  *    console.log(params);
  *    return new Promise((resolve) => {
  *      setTimeout(resolve, 1000);
  *    });
  *  };
  *  return (
  *    <Form defaultValues={defaultValues} onSubmit={onSubmit}>
  *      <FormLayout>
  *        <Field
  *          name="name"
  *          label="Name"
  *          type="text"
  *          helperText="Choose a name for this project"
  *          rules={{ required: true }}
  *        />
*
*          <Field
*            name="description"
*            type="textarea"
*            label="Description"
*            placeholder="Optional description"
*          />
*          <SubmitButton>Create Project</SubmitButton>
*        </FormLayout>
*      </Form>
*    );
*  },
*```
*/
export const Basic: Story = {
  render: () => {
    const defaultValues = {
      name: "Custom offering",
      description: "",
    };
    const onSubmit = (params: typeof defaultValues) => {
      console.log(params);
      return new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
    };
    return (
      <Form defaultValues={defaultValues} onSubmit={onSubmit}>
        <FormLayout>
          <Field
            name="name"
            label="Name"
            type="text"
            helperText="Choose a name for this project"
            rules={{ required: true }}
          />

          <Field
            name="description"
            type="textarea"
            label="Description"
            placeholder="Optional description"
          />
          <SubmitButton>Create Project</SubmitButton>
        </FormLayout>
      </Form>
    );
  },
};
