import httpErrorHandler from "@middy/http-error-handler";
import cors from "@middy/http-cors";
import jsonBodyParser from "@middy/http-json-body-parser";
import middy from "@middy/core";
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { dynamoDocClient, dynamoClient, remove } from "../../lib/dynamodb";
import { DeleteCommandInput } from "@aws-sdk/lib-dynamodb";

const db = dynamoDocClient;
const { TABLE_NAME } = process.env;

const baseHandler: APIGatewayProxyHandlerV2 = async (event) => {
  const env = event?.pathParameters?.env?.toLowerCase();
  const secretKey = event.body as string;

  if (!env) {
    return {
      statusCode: 404,
      body: "Please check your inputs. Do you have the right environment? EX: dev, prod",
    };
  }

  try {
    const response = await deleteSecret(secretKey, env);
    console.log("Deleting secret...");
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Secret deleted successfully ---> ${response}` }),
    };
  } catch (error) {
    return {
      statusCode: error.statusCode || 501,
      body: JSON.stringify({ message: `Error deleting secret ---> ${error}` }),
    };
  }
};

async function deleteSecret(secret: string, env: string) {
  const params: DeleteCommandInput = {
    TableName: TABLE_NAME || "secrets",
    Key: {
      environment: env,
      secretKey: secret,
    },
  };
  console.log("Removing secret from database...");
  console.log(`SecretKey: ${params.Key}`);
  const deleteCommand = new remove(params);

  try {
    const response = await db.send(deleteCommand);
    dynamoClient.destroy();
    return response;
  } catch (error) {
    console.log("Error deleting secret to database:", error);
    dynamoClient.destroy();
  }
}

const deleteSecretHandler = middy(baseHandler)
  .use(jsonBodyParser())
  .use(cors())
  .use(httpErrorHandler());
export { deleteSecretHandler };
