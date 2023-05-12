import { render } from "@companydotcom/test-utils";
import { Field, FieldProps, Form } from "../src";

const renderField = (props: FieldProps) => {
  return render(
    <Form onSubmit={() => Promise.resolve()}>
      <Field {...props} />
    </Form>,
  );
};

test("should render text field", async () => {
  const { getByLabelText } = renderField({
    label: "Test",
    name: "test",
    type: "text",
  });

  expect(getByLabelText("Test")).toHaveAttribute("type", "text");
});

test("should render email field", async () => {
  const { getByLabelText } = renderField({
    label: "Test",
    name: "test",
    type: "email",
  });

  expect(getByLabelText("Test")).toHaveAttribute("type", "email");
});

test("should render number field", async () => {
  const { getByLabelText } = renderField({
    label: "Test",
    name: "test",
    type: "number",
  });

  expect(getByLabelText("Test")).toHaveClass("chakra-numberinput__field");
});

test("should render textarea", async () => {
  const { getByLabelText } = renderField({
    label: "Test",
    name: "test",
    type: "textarea",
  });

  expect(getByLabelText("Test")).toHaveClass("chakra-textarea");
});

test("should render switch field", async () => {
  const { getByLabelText } = renderField({
    label: "Test",
    name: "test",
    type: "switch",
  });

  expect(getByLabelText("Test")).toHaveClass("chakra-switch__input");
});

test("should render select field", async () => {
  const { getByRole } = renderField({
    label: "Test",
    name: "test",
    type: "select",
  });

  expect(getByRole("button")).toBeInTheDocument();
});

test("should render password", async () => {
  const { getByLabelText } = renderField({
    label: "Test",
    name: "test",
    type: "password",
  });

  expect(getByLabelText("Test")).toHaveAttribute("type", "password");
});

test("should render checkbox", async () => {
  const { getByLabelText } = renderField({
    label: "Test",
    name: "test",
    type: "checkbox",
  });

  expect(getByLabelText("Test")).toHaveAttribute("type", "checkbox");
});

test("should render pin", async () => {
  const { getAllByPlaceholderText } = renderField({
    label: "Test",
    name: "test",
    type: "pin",
  });

  expect(getAllByPlaceholderText("○")).toHaveLength(4);
});
