import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  InitiateAuthCommandInput,
  RespondToAuthChallengeCommand,
  RespondToAuthChallengeCommandInput,
} from "@aws-sdk/client-cognito-identity-provider";
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import middy from "@middy/core";
import cors from "@middy/http-cors";
import inputOutputLogger from "@middy/input-output-logger";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";
import { CognitoJwtVerifier } from "aws-jwt-verify";

const { AWS_REGION, USER_POOL_ID, APP_CLIENT_ID } = process.env;

const cognitoClient = new CognitoIdentityProviderClient({ region: AWS_REGION });

// Verifier that expects valid jwt tokens:
const verifier = CognitoJwtVerifier.create({
  userPoolId: USER_POOL_ID || "",
  tokenUse: "id",
  clientId: APP_CLIENT_ID || "",
});

const verify = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
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
      ClientId: APP_CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
      },
    };
    const initiateAuthCommand = new InitiateAuthCommand(authParams);
    const cognitoUser = await cognitoClient.send(initiateAuthCommand);

    const challengeParams: RespondToAuthChallengeCommandInput = {
      ClientId: APP_CLIENT_ID,
      ChallengeName: cognitoUser?.ChallengeName,
      Session: cognitoUser?.Session,
      ChallengeResponses: {
        USERNAME: cognitoUser?.ChallengeParameters?.USERNAME || email,
        ANSWER: token,
      },
    };

    const respondToChallengeCommand = new RespondToAuthChallengeCommand(challengeParams);
    const authResponse = await cognitoClient.send(respondToChallengeCommand);

    let accounts: any = undefined;

    if (authResponse.AuthenticationResult?.IdToken) {
      const payload = await verifier.verify(authResponse.AuthenticationResult?.IdToken);

      accounts = JSON.parse(payload.accounts as string);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        token: {
          accessToken: authResponse?.AuthenticationResult?.AccessToken,
          idToken: authResponse?.AuthenticationResult?.IdToken
        },
        accounts,
      }),
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: err,
      }),
    };
  }
};

const handler = middy(verify)
  .use(jsonBodyParser())
  .use(cors())
  .use(inputOutputLogger())
  .use(httpErrorHandler());

export { handler };
