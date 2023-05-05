import httpErrorHandler from "@middy/http-error-handler";
import cors from "@middy/http-cors";
import jsonBodyParser from "@middy/http-json-body-parser";
import middy from "@middy/core";
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import type { DynamoDBDocument, PutCommandInput } from "@aws-sdk/lib-dynamodb";
import { docClient, dynamoClient } from "../../lib/dynamodb";
import { EnvVariable } from "../../lib/types";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export const baseHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log("EVENT ----->", event);
  const env = event?.pathParameters?.env?.toLowerCase();
  const input = {
    keyName: event?.body?.["keyName"],
    keyValue: event?.body?.["keyValue"],
    environment_keyName: `${env}:${event?.body?.["keyName"]}`,
    projects: event?.body?.["projects"],
  };

  if (!env) {
    return {
      statusCode: 404,
      body: "Please check your inputs. Do you have the right environment? EX: dev, prod",
    };
  }

  try {
    const response = await addVariable(input, docClient, dynamoClient);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Variables added successfully ---> ${response}` }),
    };
  } catch (error) {
    return {
      statusCode: error.statusCode || 501,
      body: JSON.stringify({ message: `Error adding variable ---> ${error}` }),
    };
  }
};

export async function addVariable(
  newVariable: EnvVariable,
  dynamoDoc: DynamoDBDocument,
  dynamo: DynamoDBClient,
) {
  const { TABLE_NAME } = process.env;
  const params: PutCommandInput = {
    TableName: TABLE_NAME || "env",
    Item: newVariable,
  };

  try {
    const response = await dynamoDoc.put(params);
    return response;
  } catch (error) {
    throw new Error("Error adding to database");
  } finally {
    dynamo.destroy();
  }
}

const addEnvHandler = middy(baseHandler).use(jsonBodyParser()).use(cors()).use(httpErrorHandler());
export { addEnvHandler };
