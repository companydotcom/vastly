import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  InitiateAuthCommandInput,
  RespondToAuthChallengeCommand,
  RespondToAuthChallengeCommandInput,
} from "@aws-sdk/client-cognito-identity-provider";
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import middy from "@middy/core";
import cors from "@middy/http-cors";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";

const { AWS_REGION } = process.env;

const cognitoClient = new CognitoIdentityProviderClient({ region: AWS_REGION });

export const baseHandler: APIGatewayProxyHandlerV2 = async (event) => {
  const { email, token } = typeof event.body === "string" ? JSON.parse(event.body) : event.body;

  if (!email || !token) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Email or token is missing!",
      }),
    };
  }

  try {
    const authParams: InitiateAuthCommandInput = {
      AuthFlow: "CUSTOM_AUTH",
      ClientId: "4vr9r59ednfan4cj167sf8mrqf",
      AuthParameters: {
        USERNAME: email,
      },
    };
    const initiateAuthCommand = new InitiateAuthCommand(authParams);
    const cognitoUser = await cognitoClient.send(initiateAuthCommand);

    const challengeParams: RespondToAuthChallengeCommandInput = {
      ClientId: "4vr9r59ednfan4cj167sf8mrqf",
      ChallengeName: cognitoUser?.ChallengeName,
      Session: cognitoUser?.Session,
      ChallengeResponses: {
        USERNAME: cognitoUser?.ChallengeParameters?.USERNAME || email,
        ANSWER: token,
      },
    };

    const respondToChallengeCommand = new RespondToAuthChallengeCommand(challengeParams);
    const authResponse = await cognitoClient.send(respondToChallengeCommand);

    return {
      statusCode: 200,
      body: JSON.stringify({
        token: authResponse?.AuthenticationResult?.AccessToken,
      }),
    };
  } catch (err) {
    console.log("err:", err);
    return {
      statusCode: 400,
    };
  }
};

const handler = middy(baseHandler).use(jsonBodyParser()).use(cors()).use(httpErrorHandler());

export { handler };
