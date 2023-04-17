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
    secretKey: event?.body?.["secretKey"],
    secretValue: event?.body?.["secretValue"],
  }

  if (!env) {
    return {
      statusCode: 404,
      body: "Please check your inputs. Do you have the right environment? EX: dev, prod",
    }
  }

  try {
    const response = await addSecret(secret)
    console.log("addSecret Response: ", response)
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Secret added successfully" }),
    }
  } catch (error) {
    return {
      statusCode: error.statusCode || 501,
      body: JSON.stringify({ message: `Error adding secret: ${error}` }),
    }
  }
}

async function addSecret(newSecret: Secret) {
  const params: PutCommandInput = {
    TableName: TABLE_NAME || "secrets",
    Item: newSecret,
  }
  console.log("Adding secret to database...")
  console.log("Secret Params: ", {
    ...params,
    Item: {
      ...params.Item,
      secretValue: "******",
    },
  })
  const addCommand = new add(params)

  try {
    const response = await db.send(addCommand)
    dynamoClient.destroy()
    return response
  } catch (error) {
    console.log("Error adding secret to database:", error)
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
