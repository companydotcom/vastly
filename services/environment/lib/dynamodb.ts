import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"
import {
  DynamoDBClient,
  QueryCommand,
  DeleteItemCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb"
// import { unmarshall, marshall } from '@aws-sdk/util-dynamodb';
const { AWS_REGION } = process.env

export const dynamoClient = new DynamoDBClient({ region: AWS_REGION })
export const dynamoDocClient = DynamoDBDocumentClient.from(dynamoClient)

export { QueryCommand as get, DeleteItemCommand as delete, PutItemCommand as add }
