import type { VerifyAuthChallengeResponseTriggerHandler } from "aws-lambda";
import { decrypt } from "../../lib/encryption";

export const handler: VerifyAuthChallengeResponseTriggerHandler = async (event) => {
  const email = event.request.userAttributes.email;

  const expected = event.request.privateChallengeParameters.challenge;
  if (event.request.challengeAnswer !== expected) {
    console.log("answer doesn't match current challenge token");
    event.response.answerCorrect = false;
    return event;
  }

  const json = await decrypt(event.request.challengeAnswer);

  const payload = JSON.parse(json ?? "");

  const isExpired = new Date().toJSON() > payload.expiration;

  if (payload.email === email && !isExpired) {
    event.response.answerCorrect = true;
  }

  if (payload.email !== email) {
    console.log("email doesn't match");
    event.response.answerCorrect = false;
  }

  if (isExpired) {
    console.log("token is expired");
    event.response.answerCorrect = false;
  }

  return event;
};
