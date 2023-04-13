import { EventKeys } from "./../../../../packages/ui/src/utils/types"
import httpErrorHandler from "@middy/http-error-handler"
import cors from "@middy/http-cors"
import jsonBodyParser from "@middy/http-json-body-parser"
import middy from "@middy/core"
import type { APIGatewayProxyHandlerV2 } from "aws-lambda"
import { dynamoDocClient, dynamoClient, remove } from "../../lib/dynamodb"
import { DeleteItemCommandInput, PutItemCommandInput } from "@aws-sdk/client-dynamodb"

const db = dynamoDocClient
const { TABLE_NAME } = process.env

const baseHandler: APIGatewayProxyHandlerV2 = async (event) => {
  const env = event?.pathParameters?.env?.toLowerCase()
  const secret = event?.body?.["secretKey"]

  if (!env) {
    return {
      statusCode: 404,
      body: "Please check your inputs. Do you have the right environment? EX: dev, prod",
    }
  }

  try {
    const response = await deleteSecret(secret)
    console.log(
      "🚀 ~ file: handler.ts:21 ~ constbaseHandler:APIGatewayProxyHandlerV2= ~ response:",
      response,
    )
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    }
  } catch (error) {
    return {
      statusCode: error.statusCode || 501,
      body: JSON.stringify(error),
    }
  }
}

async function deleteSecret(secret: string) {
  console.log("Removing secret to database...")
  const params: DeleteItemCommandInput = {
    TableName: TABLE_NAME,
    Key: {
      name: {
        S: secret,
      },
    },
  }
  const deleteCommand = new remove(params)

  try {
    const response = await dynamoClient.send(deleteCommand)
    dynamoClient.destroy()
    return response
  } catch (error) {
    dynamoClient.destroy()
  }
}

const handler = middy(baseHandler).use(jsonBodyParser()).use(cors()).use(httpErrorHandler())
export { handler }
// TODO: log and type event, error
