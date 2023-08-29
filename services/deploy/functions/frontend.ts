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

  try {
    const stsClient = new STSClient({ region: AWS_REGION });
    // Hard-coded account_Id for infra-prod account
    const input = {
      RoleArn: "arn:aws:iam::908170539157:role/DeployAssumeRole",
      RoleSessionName: "testAssumeDeployRoleSession",
      DurationSeconds: 900, // minimum 15 minutes
    };

    const command = new AssumeRoleCommand(input);
    const response = await stsClient.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify(response.Credentials),
    };
  } catch (error) {
    return {
      statusCode: error.$metadata.httpStatusCode,
      body: JSON.stringify(error.message),
    };
  }
};

const handler = middy(deployFrontend).use(cors()).use(httpErrorHandler());

export { handler };
