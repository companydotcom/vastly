import {
  CognitoIdentityProviderClient,
  AdminUpdateUserAttributesCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import cors from "@middy/http-cors";
import jsonBodyParser from "@middy/http-json-body-parser";
import { TIMEOUT_MINS } from "../../lib/constants";
import { encrypt } from "../../lib/encryption";

const { SES_FROM_ADDRESS, USER_POOL_ID, BASE_URL, AWS_REGION } = process.env;
const ONE_MIN = 60 * 1000;

const cognitoClient = new CognitoIdentityProviderClient({ region: AWS_REGION });
const sesClient = new SESClient({ region: AWS_REGION });

const logIn = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { email } = typeof event.body === "string" ? JSON.parse(event.body) : event.body;

  if (!email) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        status: "EMAIL_MISSING",
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
  const token = new URLSearchParams({ "": tokenRaw || "" }).toString().slice(1);
  const magicLink = `http://${BASE_URL}?email=${email}&token=${token}`;

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
          Value: tokenRaw,
        },
      ],
    });

    await cognitoClient.send(command);
  } catch (error) {
    console.log("ERROR: ", error);
    return {
      statusCode: 404,
      body: JSON.stringify({
        status: "USER_NOT_FOUND",
        message: "User not found",
      }),
    };
  }

  await sendEmail(email, magicLink);
  return {
    statusCode: 202,
    body: JSON.stringify({ status: "EMAIL_SENT", message: "The email has been sent!" }),
  };
};

async function sendEmail(emailAddress: string, magicLink: string) {
  try {
    const emailInput = {
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
    };

    const command = new SendEmailCommand(emailInput);

    await sesClient.send(command);
  } catch (error) {
    console.log("Error sending email:", error);
    return error;
  }
}

const handler = middy(logIn).use(jsonBodyParser()).use(cors()).use(httpErrorHandler());

export { handler };
