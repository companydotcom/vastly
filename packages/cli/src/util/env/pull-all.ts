import { errorToString } from "@vastly/utils";
import type { NativeAttributeValue } from "@aws-sdk/util-dynamodb";
import type { QueryCommandInput, ScanCommandInput } from "@aws-sdk/lib-dynamodb";
import { docClient, dynamoClient } from "./dynamo-client.js";

export async function getAllEnv(app: string): Promise<any> {
  const input: QueryCommandInput = {
    TableName: "env",
    KeyConditionExpression: "app = :app",
    ExpressionAttributeValues: {
      ":app": app,
    },
  };

  try {
    const { Items } = await docClient.query(input);
    const keyValuePairs = Items?.map(({ keyValue, keyName }) => ({ [keyName]: keyValue }));

    return keyValuePairs;
  } catch (error) {
    console.log(error);
    throw new Error(`${errorToString(error)}`);
  } finally {
    dynamoClient.destroy();
  }
}

export async function getAppsFromTable(): Promise<
  Record<string, NativeAttributeValue>[] | undefined
> {
  const input: ScanCommandInput = {
    TableName: "env",
    ProjectionExpression: "app",
  };

  try {
    const { Items } = await docClient.scan(input);
    const appItems = Array.from(new Set(Items?.map((item) => item.app)));

    return appItems;
  } catch (error) {
    console.log(error);
    throw new Error(`${errorToString(error)}`);
  } finally {
    dynamoClient.destroy();
  }
}