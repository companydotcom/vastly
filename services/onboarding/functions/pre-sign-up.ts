import type { PreSignUpTriggerHandler } from "aws-lambda";

const handler: PreSignUpTriggerHandler = async (event) => {
  event.response.autoConfirmUser = true;
  return event;
};

export { handler };
