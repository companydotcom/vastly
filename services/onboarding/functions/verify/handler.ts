import {
  CognitoIdentityProviderClient,
  GetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";

export const handler = async () => {
  // should take a payload with token (maybe email)
  // this payload comes from magiclink on frontend containing token

  // compare token to local token
  return { true: "" };
};
