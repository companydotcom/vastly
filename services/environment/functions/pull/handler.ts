import httpErrorHandler from "@middy/http-error-handler";
import cors from "@middy/http-cors";
import jsonBodyParser from "@middy/http-json-body-parser";
import middy from "@middy/core";
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { pull, dynamoClient, dynamoDocClient } from "../../lib/dynamodb";

const db = dynamoDocClient;
const { TABLE_NAME } = process.env;

const baseHandler: APIGatewayProxyHandlerV2 = async (event) => {
  const env = event?.pathParameters?.env?.toLowerCase();
  if (!env) {
    return {
      statusCode: 404,
      body: "You must provide a valid environment name.",
    };
  }

  try {
    const response = await getAllEnv(env);
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    return {
      statusCode: error.statusCode || 501,
      body: JSON.stringify(error),
    };
  }
};

async function getAllEnv(env: string) {
  console.log(`Fetching variables for ${env}...`);
  const input: QueryCommandInput = {
    ExpressionAttributeValues: {
      ":v1": env,
    },
    KeyConditionExpression: "environment = :v1",
    TableName: TABLE_NAME || "env",
  };
  const queryCommand = new pull(input);

  try {
    const { Items } = await db.send(queryCommand);
    return Items;
  } catch (error) {
    console.log("Error fetching variables: ", error);
  } finally {
    dynamoClient.destroy();
  }
}

const getAllEnvHandler = middy(baseHandler)
  .use(jsonBodyParser())
  .use(cors())
  .use(httpErrorHandler());

export { getAllEnvHandler };
