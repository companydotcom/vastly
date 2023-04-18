import type { DefineAuthChallengeTriggerHandler } from "aws-lambda";
import { isEmpty } from "@companydotcom/utils";

export const handler: DefineAuthChallengeTriggerHandler = async (event) => {
  if (event.request.userNotFound) {
    event.response.issueTokens = false;
    event.response.failAuthentication = true;
    return event;
  }

  if (isEmpty(event.request.session)) {
    // Issue new challenge
    event.response.issueTokens = false;
    event.response.failAuthentication = false;
    event.response.challengeName = "CUSTOM_CHALLENGE";
  } else {
    const lastAttempt = event.request.session[event.request.session.length - 1];
    if (lastAttempt.challengeResult === true) {
      // User gave right answer
      event.response.issueTokens = true;
      event.response.failAuthentication = false;
    } else {
      // User gave wrong answer
      event.response.issueTokens = false;
      event.response.failAuthentication = true;
    }
  }

  return event;
};
