import { Button } from "@companydotcom/ui";
import { Form, Field } from "@companydotcom/forms";

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
