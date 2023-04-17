import httpErrorHandler from "@middy/http-error-handler"
import cors from "@middy/http-cors"
import jsonBodyParser from "@middy/http-json-body-parser"
import middy from "@middy/core"
import type { APIGatewayProxyHandlerV2 } from "aws-lambda"
import { dynamoDocClient, add, dynamoClient } from "../../lib/dynamodb"
import { PutCommandInput } from "@aws-sdk/lib-dynamodb"

const db = dynamoDocClient
const { TABLE_NAME } = process.env

const baseHandler: APIGatewayProxyHandlerV2 = async (event) => {
  const env = event?.pathParameters?.env?.toLowerCase()
  const secret = {
    environment: env,
    name: event?.body?.["secretKey"],
    value: event?.body?.["secretValue"],
  }

  if (!env) {
    return {
      statusCode: 404,
      body: "Please check your inputs. Do you have the right environment? EX: dev, prod",
    }
  }

  try {
    const response = await addSecret(secret)
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

async function addSecret(newSecret: Secret) {
  console.log("Adding secret to database...")
  const params: PutCommandInput = {
    TableName: TABLE_NAME,
    Item: newSecret,
  }
  const addCommand = new add(params)

  try {
    const response = await db.send(addCommand)
    dynamoClient.destroy()
    return response
  } catch (error) {
    dynamoClient.destroy()
  }
}

interface Secret {
  environment?: string
  name?: string
  value?: string
}

const addSecretHandler = middy(baseHandler)
  .use(jsonBodyParser())
  .use(cors())
  .use(httpErrorHandler())
export { addSecretHandler }
