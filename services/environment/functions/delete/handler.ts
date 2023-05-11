import httpErrorHandler from "@middy/http-error-handler";
import cors from "@middy/http-cors";
import jsonBodyParser from "@middy/http-json-body-parser";
import middy from "@middy/core";
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import type { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import type { DeleteCommandInput, DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { docClient, dynamoClient } from "../../lib/dynamodb";

const { TABLE_NAME } = process.env;

const baseHandler = async ({
  pathParameters,
  body,
  queryStringParameters,
}: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const env = pathParameters?.env?.toLowerCase();
  const projects = queryStringParameters?.["p"] || "";
  const keyName = body as string;

  if (!env) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: "Missing env parameter",
      }),
    };
  }

  try {
    await deleteVariable({ keyName, env, projects }, docClient, dynamoClient);
    console.log("Deleting...");
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Variable deleted successfully" }),
    };
  } catch (error) {
    return {
      statusCode: 501,
      body: JSON.stringify({ message: "Error deleting variable" }),
    };
  }
};

async function deleteVariable(
  { keyName, env, projects }: { keyName: string; env: string; projects: string },
  dynamoDoc: DynamoDBDocument,
  dynamo: DynamoDBClient,
) {
  const params: DeleteCommandInput = {
    TableName: TABLE_NAME || "env",
    Key: {
      environment_keyName: `${env}:${keyName}`,
      projects,
    },
    ConditionExpression: `attribute_exists(keyName)`,
  };
  console.log("EnvKey: ", params.Key);

  try {
    const response = await dynamoDoc.delete(params);
    return response;
  } catch (error) {
    console.log(error);
    throw Error("Error deleting from database");
  } finally {
    dynamo.destroy();
  }
}

const deleteEnvHandler = middy(baseHandler)
  .use(jsonBodyParser())
  .use(cors())
  .use(httpErrorHandler());
export { deleteEnvHandler, baseHandler, deleteVariable };
