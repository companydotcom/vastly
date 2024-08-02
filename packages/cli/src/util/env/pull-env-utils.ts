import { errorToString } from "@vastly/utils";
import type { NativeAttributeValue } from "@aws-sdk/util-dynamodb";
import type { QueryCommandInput, ScanCommandInput } from "@aws-sdk/lib-dynamodb";
import { docClient, dynamoClient } from "./dynamo-client.js";

export async function getEnvsPerApp(app: string, stage: string): Promise<any> {
  const input: QueryCommandInput = {
    TableName: "env",
    KeyConditionExpression: "app = :app",
    FilterExpression: "stage = :stage",
    ExpressionAttributeValues: {
      ":app": app,
      ":stage": stage,
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

export async function getAllEnv(stage: string): Promise<any> {
  const input: ScanCommandInput = {
    TableName: "env",
    FilterExpression: "stage = :stage",
    ExpressionAttributeValues: {
      ":stage": stage,
    },
  };

  try {
    const { Items } = await docClient.scan(input);
    const keyValuePairs = Items?.map(({ keyValue, keyName }) => ({ [keyName]: keyValue }));

    return keyValuePairs;
  } catch (error) {
    console.log(error);
    throw new Error(`${errorToString(error)}`);
  } finally {
    dynamoClient.destroy();
  }
}
