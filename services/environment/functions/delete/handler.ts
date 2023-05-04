import httpErrorHandler from "@middy/http-error-handler";
import cors from "@middy/http-cors";
import jsonBodyParser from "@middy/http-json-body-parser";
import middy from "@middy/core";
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import type { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import type { DeleteCommandInput, DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { docClient, dynamoClient } from "../../lib/dynamodb";

const { TABLE_NAME } = process.env;

const baseHandler: APIGatewayProxyHandlerV2 = async (event) => {
  const env = event?.pathParameters?.env?.toLowerCase();
  const project = event?.queryStringParameters?.["p"] || "";
  const keyName = event.body as string;

  if (!env) {
    return {
      statusCode: 404,
      body: "Please check your inputs. Do you have the right environment? EX: dev, prod",
    };
  }

  try {
    const response = await deleteVariable(keyName, env, project, docClient, dynamoClient);
    console.log("Deleting...");
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Variable deleted successfully ---> ${response}` }),
    };
  } catch (error) {
    return {
      statusCode: error.statusCode || 501,
      body: JSON.stringify({ message: `Error deleting variable ---> ${error}` }),
    };
  }
};

async function deleteVariable(
  key: string,
  env: string,
  projects: string,
  dynamoDoc: DynamoDBDocument,
  dynamo: DynamoDBClient,
) {
  const params: DeleteCommandInput = {
    TableName: TABLE_NAME || "env",
    Key: {
      environment_keyName: `${env}:${key}`,
      projects,
    },
  };
  console.log(`EnvKey: ${params.Key}`);

  try {
    const response = await dynamoDoc.delete(params);
    return response;
  } catch (error) {
    console.log("Error deleting from database:", error);
  } finally {
    dynamo.destroy();
  }
}

const deleteEnvHandler = middy(baseHandler)
  .use(jsonBodyParser())
  .use(cors())
  .use(httpErrorHandler());
export { deleteEnvHandler };
