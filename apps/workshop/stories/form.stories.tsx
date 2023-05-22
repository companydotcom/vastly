import type { Meta, StoryObj } from "@storybook/react";
import { Form, Field, SubmitButton, FormLayout } from "@vastly/forms";

const meta: Meta<typeof Form> = {
  component: Form,
  title: "Forms/Form",
};

export default meta;
type Story = StoryObj<typeof Form>;

export const Basic: Story = {
  render: function CustomRenderer() {
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
