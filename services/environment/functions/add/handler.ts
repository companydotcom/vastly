import httpErrorHandler from "@middy/http-error-handler";
import cors from "@middy/http-cors";
import jsonBodyParser from "@middy/http-json-body-parser";
import middy from "@middy/core";
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import type { DynamoDBDocument, PutCommandInput } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { docClient, dynamoClient } from "../../lib/dynamodb";
import { EnvVariable } from "../../lib/types";

const baseHandler = async ({
  pathParameters,
  body,
}: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log("EVENT ----->", { body, pathParameters });
  const parsedBody = typeof body === "string" ? JSON.parse(body ?? "") : body;

  const env = pathParameters?.env?.toLowerCase();
  const input: EnvVariable = {
    keyName: parsedBody?.["keyName"],
    keyValue: parsedBody?.["keyValue"],
    environment_keyName: `${env}:${parsedBody?.["keyName"]}`,
    projects: parsedBody?.["projects"] ?? "",
  };

  if (!env) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: "Missing env parameter",
      }),
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
      statusCode: 501,
      body: JSON.stringify({ message: `Error adding variable ---> ${error}` }),
    };
  }
};

async function addVariable(
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
export { addEnvHandler, baseHandler, addVariable };
