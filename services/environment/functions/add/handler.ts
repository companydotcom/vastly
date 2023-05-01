import httpErrorHandler from "@middy/http-error-handler";
import cors from "@middy/http-cors";
import jsonBodyParser from "@middy/http-json-body-parser";
import middy from "@middy/core";
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { PutCommandInput } from "@aws-sdk/lib-dynamodb";
import { dynamoDocClient, add, dynamoClient } from "../../lib/dynamodb";
import { EnvVariable } from "../../lib/types";

const db = dynamoDocClient;
const { TABLE_NAME } = process.env;

const baseHandler: APIGatewayProxyHandlerV2 = async (event) => {
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
    const response = await addVariable(input);
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

async function addVariable(newVariable: EnvVariable) {
  const params: PutCommandInput = {
    TableName: TABLE_NAME || "env",
    Item: newVariable,
  };
  console.log("Adding to database...");
  console.log("ENV Params: ", {
    ...params,
    Item: {
      ...params.Item,
      keyValue: "******",
    },
  });
  const addCommand = new add(params);

  try {
    const response = await db.send(addCommand);
    return response;
  } catch (error) {
    console.log("Error adding to database:", error);
  } finally {
    dynamoClient.destroy();
  }
}

const addEnvHandler = middy(baseHandler).use(jsonBodyParser()).use(cors()).use(httpErrorHandler());
export { addEnvHandler };
