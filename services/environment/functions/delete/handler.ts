import httpErrorHandler from "@middy/http-error-handler";
import cors from "@middy/http-cors";
import jsonBodyParser from "@middy/http-json-body-parser";
import middy from "@middy/core";
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DeleteCommandInput } from "@aws-sdk/lib-dynamodb";
import { dynamoDocClient, dynamoClient, remove } from "../../lib/dynamodb";

const db = dynamoDocClient;
const { TABLE_NAME } = process.env;

const baseHandler: APIGatewayProxyHandlerV2 = async (event) => {
  const env = event?.pathParameters?.env?.toLowerCase();
  const key = event.body as string;

  if (!env) {
    return {
      statusCode: 404,
      body: "Please check your inputs. Do you have the right environment? EX: dev, prod",
    };
  }

  try {
    const response = await deleteVariable(key, env);
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

async function deleteVariable(key: string, env: string) {
  const params: DeleteCommandInput = {
    TableName: TABLE_NAME || "env",
    Key: {
      environment: env,
      key,
    },
  };
  console.log("Removing variable from database...");
  console.log(`EnvKey: ${params.Key}`);
  const deleteCommand = new remove(params);

  try {
    const response = await db.send(deleteCommand);
    return response;
  } catch (error) {
    console.log("Error deleting from database:", error);
  } finally {
    dynamoClient.destroy();
  }
}

const deleteEnvHandler = middy(baseHandler)
  .use(jsonBodyParser())
  .use(cors())
  .use(httpErrorHandler());
export { deleteEnvHandler };
