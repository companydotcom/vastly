import { DynamoDBDocument, DeleteCommand, QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export const dynamoClient = new DynamoDBClient({ region: "us-east-1" });
export const docClient = DynamoDBDocument.from(dynamoClient);

export { QueryCommand as pull, DeleteCommand as remove, ScanCommand as scan };
