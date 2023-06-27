import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  CognitoIdentityProviderClient,
  GetUserCommand,
  AttributeType,
} from "@aws-sdk/client-cognito-identity-provider";
import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import cors from "@middy/http-cors";
import inputOutputLogger from "@middy/input-output-logger";
import { getTokenFromBearer } from "../lib/utils";

const { AWS_REGION } = process.env;

const cognitoClient = new CognitoIdentityProviderClient({ region: AWS_REGION });

const getUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const input = {
    AccessToken: getTokenFromBearer(event.headers?.["Authorization"] || ""),
  };

  const command = new GetUserCommand(input);
  const response = await cognitoClient.send(command);

  if (response && response.UserAttributes?.some((att) => att.Name === "email")) {
    const email = response.UserAttributes?.find((att) => att.Name === "email");

    return {
      statusCode: 200,
      body: JSON.stringify(convertInputToOutput(email)),
    };
  }

  return {
    statusCode: 404,
    body: JSON.stringify({
      error: {
        code: "USER_NOT_FOUND",
        message: "User not found",
      },
    }),
  };
};

function convertInputToOutput(input?: AttributeType) {
  if (!input) {
    return {};
  }

  const output = {};
  output[input.Name || ""] = input.Value;
  return output;
}

const handler = middy(getUser).use(cors()).use(inputOutputLogger()).use(httpErrorHandler());

export { handler };
