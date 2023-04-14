import {
  CognitoIdentityProviderClient,
  AdminUpdateUserAttributesCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import validator from "@middy/validator";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import cors from "@middy/http-cors";
import jsonBodyParser from "@middy/http-json-body-parser";
import { TIMEOUT_MINS } from "../../lib/constants";
import { encrypt } from "../../lib/encryption";
import { eventSchema, responseSchema } from "./schema";

const { SES_FROM_ADDRESS, USER_POOL_ID, BASE_URL, AWS_REGION } = process.env;
const ONE_MIN = 60 * 1000;

const cognitoClient = new CognitoIdentityProviderClient({ region: AWS_REGION });
const sesClient = new SESClient({ region: AWS_REGION });

const baseHandler: APIGatewayProxyHandlerV2 = async (event) => {
  const { email } = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
  if (!email) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "You must provide a valid email.",
      }),
    };
  }

  // only send the magic link on the first attempt
  const now = new Date();
  const expiration = new Date(now.getTime() + ONE_MIN * TIMEOUT_MINS);
  const payload = {
    email,
    expiration: expiration.toJSON(),
  };

  const tokenRaw = await encrypt(JSON.stringify(payload));
  const tokenB64 = tokenRaw ? Buffer.from(tokenRaw).toString("base64") : "";
  const token = new URLSearchParams({ "": tokenB64 }).toString().slice(1);
  const magicLink = `https://${BASE_URL}/magic-link?email=${email}&token=${token}`;

  try {
    // the decision to use Cognito’s user attributes has an impact on the number of users
    // that can sign in at the same time. Because Cognito has a hard limit of 25 reqs/sec
    // on AdminSetUserAttribute. If you’re likely to experience thundering herd problems
    // then you should consider using DynamoDB to record the secret token instead.
    const command = new AdminUpdateUserAttributesCommand({
      UserPoolId: USER_POOL_ID,
      Username: email,
      UserAttributes: [
        {
          Name: "custom:authChallenge",
          Value: tokenB64,
        },
      ],
    });

    await cognitoClient.send(command);
  } catch (error) {
    console.log("err", error);
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: "User not found",
      }),
    };
  }

  await sendEmail(email, magicLink);
  return {
    statusCode: 202,
    body: JSON.stringify({ message: "accepted" }),
  };
};

async function sendEmail(emailAddress: string, magicLink: string) {
  try {
    const command = new SendEmailCommand({
      Destination: {
        ToAddresses: [emailAddress],
      },
      Source: SES_FROM_ADDRESS,
      Message: {
        Subject: {
          Charset: "UTF-8",
          Data: "Your one-time sign in link",
        },
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: `<html><body><p>This is your one-time sign in link (it will expire in ${TIMEOUT_MINS} mins):</p>
              <h3>${magicLink}</h3></body></html>`,
          },
          Text: {
            Charset: "UTF-8",
            Data: `Your one-time sign in link (it will expire in ${TIMEOUT_MINS} mins): ${magicLink}`,
          },
        },
      },
    });

    await sesClient.send(command);
  } catch (error) {
    console.log("sendEmail ~ error:", error);
    return error;
  }
}

const handler = middy(baseHandler)
  .use(jsonBodyParser())
  .use(
    validator({
      eventSchema,
      responseSchema,
    }),
  )
  .use(cors())
  .use(httpErrorHandler());

export { handler };
