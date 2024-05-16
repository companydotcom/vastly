import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export const dynamoClient = new DynamoDBClient({ region: "us-east-1" });
export const docClient = DynamoDBDocument.from(dynamoClient);
