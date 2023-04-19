import {
  DynamoDBDocumentClient,
  PutCommand,
  DeleteCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const { AWS_REGION } = process.env;

export const dynamoClient = new DynamoDBClient({ region: AWS_REGION });
export const dynamoDocClient = DynamoDBDocumentClient.from(dynamoClient);

export { QueryCommand as get, DeleteCommand as remove, PutCommand as add };
