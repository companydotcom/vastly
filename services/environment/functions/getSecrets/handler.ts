import httpErrorHandler from "@middy/http-error-handler"
import cors from "@middy/http-cors"
import jsonBodyParser from "@middy/http-json-body-parser"
import middy from "@middy/core"
import type { APIGatewayProxyHandlerV2 } from "aws-lambda"
import { dynamoDocClient, get, dynamoClient } from "../../lib/dynamodb"

const db = dynamoDocClient

const baseHandler: APIGatewayProxyHandlerV2 = async (event) => {
  const env = event?.pathParameters?.env
  if (!env) {
    return {
      statusCode: 404,
      body: "You must provide a valid environment name.",
    }
  }

  try {
    const response = await getSecrets(env)
    return {
      statusCode: 200,
      body: response,
    }
  } catch (error) {
    return {
      statusCode: error.statusCode || 501,
      body: error,
    }
  }
}

async function getSecrets(env: string) {
  const params = {
    TableName: "secrets",
    Item: {
      environment: env,
    },
  }
  const query = new get(params)

  try {
    const { Items } = await db.send(query)
    dynamoClient.destroy()
    return Items
  } catch (error) {
    dynamoClient.destroy()
  }
}

const handler = middy(baseHandler).use(jsonBodyParser()).use(cors()).use(httpErrorHandler())

export { handler }
// TODO: log and type event, error
