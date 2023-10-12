import type {
  APIGatewayTokenAuthorizerEvent,
  PolicyDocument,
  Statement,
  AuthResponse,
} from "aws-lambda";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import middy from "@middy/core";
import inputOutputLogger from "@middy/input-output-logger";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument, GetCommand } from "@aws-sdk/lib-dynamodb";
import {
  CognitoIdentityProviderClient,
  AdminGetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { getTokenFromBearer } from "../lib/utils";

const { USER_POOL_ID, APP_CLIENT_ID, AWS_REGION } = process.env;
const dynamoClient = new DynamoDBClient({ region: AWS_REGION });
const docClient = DynamoDBDocument.from(dynamoClient);
const cognitoClient = new CognitoIdentityProviderClient({ region: AWS_REGION });

// Verifier that expects valid access tokens:
const verifier = CognitoJwtVerifier.create({
  userPoolId: USER_POOL_ID || "",
  tokenUse: "access",
  clientId: APP_CLIENT_ID || "",
});

const authorize = async (event: APIGatewayTokenAuthorizerEvent) => {
  if (!event.authorizationToken) {
    throw new Error("Unauthorized");
  }

  const accessToken = getTokenFromBearer(event.authorizationToken);

  try {
    // decode jwt token, if valid, generate allow policy
    const payload = await verifier.verify(accessToken);
    // query User table by userid (username || sub)
    // and get the users available accounts
    // return account id from this function if it exists

    if (payload) {
      console.log("🟢 Token is valid. Payload:", payload);

      const getUserFromCognitocommand = new AdminGetUserCommand({
        UserPoolId: USER_POOL_ID,
        Username: payload?.username,
      });

      const cognitoUser = await cognitoClient.send(getUserFromCognitocommand);

      const organization = cognitoUser?.UserAttributes?.find(
        (att) => att?.Name === "custom:organization",
      )?.Value;

      const command = new GetCommand({
        TableName: "User",
        Key: {
          user_id: payload?.username,
          organization,
        },
      });

      const { Item } = await docClient.send(command);

      return generateAllow(payload.sub, event.methodArn);
    }
  } catch (error: any) {
    console.log("🔴 Access forbidden:", error);

    if (error.type === "INVALID_CLAIMS") {
      return generateDeny("", event.methodArn, {
        body: JSON.stringify({
          message: "invalid claim",
          claimValidationErrors: error.payload,
        }),
      });
    } else if (error.type === "JwtExpiredError") {
      return generateDeny("", event.methodArn, {
        body: JSON.stringify({
          message: "Your JWT token has expired. Please login again.",
          error: error.payload,
        }),
      });
    } else {
      return generateDeny("", event.methodArn, {
        body: JSON.stringify({
          message: "Unauthorized.",
          error: error.payload,
        }),
      });
    }
  }
};

// Help function to generate an IAM policy
const generatePolicy = function (
  principalId: string,
  effect: string,
  resource: string,
  context?: any,
) {
  // Required output:
  const policyDocument: PolicyDocument = {
    Version: "2012-10-17",
    Statement: [],
  };

  const statementOne: Statement = {
    Action: "execute-api:Invoke",
    Effect: effect,
    Resource: resource,
  };

  policyDocument.Statement[0] = statementOne;

  const authResponse: AuthResponse = {
    principalId: principalId,
    policyDocument: policyDocument,
    // Optional output with custom properties of the String, Number or Boolean type.
    context,
  };

  return authResponse;
};

const generateAllow = function (principalId: string, resource: string, context?: any) {
  return generatePolicy(principalId, "Allow", resource, context);
};

const generateDeny = function (principalId: string, resource: string, context?: any) {
  return generatePolicy(principalId, "Deny", resource, context);
};

const handler = middy(authorize).use(inputOutputLogger());

export { handler };
