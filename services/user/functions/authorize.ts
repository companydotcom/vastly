import type {
  APIGatewayTokenAuthorizerEvent,
  PolicyDocument,
  Statement,
  AuthResponse,
} from "aws-lambda";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import middy from "@middy/core";
import inputOutputLogger from "@middy/input-output-logger";

const { USER_POOL_ID, APP_CLIENT_ID } = process.env;

// Verifier that expects valid access tokens:
const verifier = CognitoJwtVerifier.create({
  userPoolId: USER_POOL_ID || "",
  tokenUse: "access",
  clientId: APP_CLIENT_ID || "",
  scope: "read",
});

const authorize = async (event: APIGatewayTokenAuthorizerEvent) => {
  if (!event.authorizationToken) {
    throw new Error("Unauthorized");
  }

  const accessToken = event.authorizationToken?.includes("Bearer")
    ? event.authorizationToken?.split(" ")[1]
    : event?.authorizationToken;

  try {
    // decode jwt token, if valid, generate allow policy
    const payload = await verifier.verify(accessToken);

    if (payload) {
      console.log("🟢 Token is valid. Payload:", payload);

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
    }
    throw new error("Unauthorized");
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
