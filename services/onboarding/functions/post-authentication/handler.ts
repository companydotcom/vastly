import type { PostAuthenticationTriggerHandler } from "aws-lambda";

export const handler: PostAuthenticationTriggerHandler = async (event) => {
  console.log("👾 ~ consthandler:PostAuthenticationTriggerHandler= ~ event:", event);
  return event;
};
