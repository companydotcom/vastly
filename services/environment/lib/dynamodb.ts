import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb"
import { DynamoDBClient, DeleteItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb"
const { AWS_REGION } = process.env

export const dynamoClient = new DynamoDBClient({ region: AWS_REGION })
export const dynamoDocClient = DynamoDBDocumentClient.from(dynamoClient)

export { QueryCommand as get, DeleteItemCommand as remove, PutCommand as add }
