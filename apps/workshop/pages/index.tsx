import { Button } from "@vastly/ui";
import { Form, Field } from "@vastly/forms";

export default function Web() {
  return (
    <div>
      <h1>Web</h1>
      <Button colorScheme="blue">Test</Button>
      <Form onSubmit={() => {}}>
        <Field name="t" label="Input" />
      </Form>
    </div>
  );
}
