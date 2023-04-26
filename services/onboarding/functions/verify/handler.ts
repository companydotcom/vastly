// import { RevokeTokenCommand } from "@aws-sdk/client-cognito-identity-provider";

export const handler = async (event) => {
  // token, email
  console.log("👾 ~ handler ~ event:", event);

  // initiates Auth
  // sends challenge answer
  return {
    ping: "pong",
  };
};
