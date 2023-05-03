import {
  CognitoIdentityProviderClient,
  GlobalSignOutCommand,
  GlobalSignOutCommandInput,
} from "@aws-sdk/client-cognito-identity-provider";
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import cors from "@middy/http-cors";

const { AWS_REGION } = process.env;

const cognitoClient = new CognitoIdentityProviderClient({ region: AWS_REGION });

async function logOut(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const { token } = typeof event.body === "string" ? JSON.parse(event.body) : event.body;

  if (!token) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        status: "TOKEN_NOT_FOUND",
        message: "Token not found",
      }),
    };
  }

  try {
    const input: GlobalSignOutCommandInput = {
      AccessToken: token,
    };
    const command = new GlobalSignOutCommand(input);
    await cognitoClient.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({ status: "USER_SIGNED_OUT", message: "User successfully signed out" }),
    };
  } catch (err: unknown) {
    console.log("Error logging out: ", err);
    return {
      statusCode: 400,
      body: JSON.stringify({
        status: "LOGOUT_ERROR",
        message: "Something went wrong logging the user out",
      }),
    };
  }
}

const handler = middy(logOut).use(cors()).use(httpErrorHandler());

export { handler };
