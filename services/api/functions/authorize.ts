import type {
  APIGatewayRequestAuthorizerEvent,
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

// The authorizer currently checks for the Authroization token from the request,
// validates it, and if its valid, we then grab the users organization from Cognito,
// the users assigned accounts from the Dynamo User table, and cross checks the passed query parameter called
// stage. If the stage param exists on the users accounts, add the id to the response context, and proceed

const authorize = async (event: APIGatewayRequestAuthorizerEvent) => {
  if (!event.headers?.Authorization) {
    throw new Error("Unauthorized.  Missing the Authorization header.");
  }

  const stage = event.queryStringParameters?.stage;

  const accessToken = getTokenFromBearer(event.headers?.Authorization);

  try {
    // decode jwt token, if valid, generate allow policy
    const payload = await verifier.verify(accessToken);

    if (payload) {
      console.log("🟢 Token is valid. Payload:", payload);

      if (!stage) {
        return generateAllow(payload.sub, event.methodArn);
      } else {
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

        let targetAccountId: number;

        if (Item?.accounts?.some?.((account) => account?.account_alias === stage)) {
          const id = Item?.accounts?.find?.((account) => account?.account_alias === stage)
            ?.account_id;

          targetAccountId = id;

          return generateAllow(payload.sub, event.methodArn, { targetAccountId });
        } else {
          throw new Error("Can't find given account alias for the user");
        }
      }
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
