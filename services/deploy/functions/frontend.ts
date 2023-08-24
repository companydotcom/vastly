import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import cors from "@middy/http-cors";
import { STSClient, AssumeRoleCommand } from '@aws-sdk/client-sts';

const { AWS_REGION } = process.env;

const deployFrontend = async ({
  pathParameters,
}: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const account_Id = pathParameters?.account_Id;
  // assume role here?

  return {
    statusCode: 200,
    body: JSON.stringify(""),
  };
};

const handler = middy(deployFrontend).use(cors()).use(httpErrorHandler());

export { handler };
