import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBDocumentClient, PutCommandInput } from "@aws-sdk/lib-dynamodb";
import { describe, expect, test, beforeEach } from "vitest";
import { handlers, server } from "./utils/mock-server";
import AWSMock from "aws-sdk-mock";
import AWS from "aws-sdk";
import { PutItemInput } from "aws-sdk/clients/dynamodb";

// const ddbMock = mockClient(DynamoDBDocumentClient);

interface ExpectedResult {
  ConsumedCapacity: { CapacityUnits: number; TableName: string };
}

beforeEach(() => {
  AWSMock.restore("DynamoDB.DocumentClient");
  // server.listen({ onUnhandledRequest: "error" });
});

describe("Add Env", () => {
  test("should add an env entry to dynamoDB mock client \n", async () => {
    const input: PutItemInput = {
      TableName: "env",
      ReturnConsumedCapacity: "TOTAL",
      Item: {
        keyName: {
          S: "MY_SECRET",
        },
        keyValue: {
          S: "123456789098",
        },
        environment_keyName: {
          S: "dev:MY_SECRET",
        },
        projects: {
          S: "newProject",
        },
      },
    };

    const expected: ExpectedResult = {
      ConsumedCapacity: { CapacityUnits: 1, TableName: "env" },
    };

    // Test code
    AWSMock.setSDKInstance(AWS);
    AWSMock.mock(
      "DynamoDB.DocumentClient",
      "put",
      (
        _input: PutCommandInput,
        callback: (error: null, result: ExpectedResult) => void = () => callback(null, expected),
      ) => {
        console.log("DynamoDB.DocumentClient", "put", "mock called");
        callback(null, expected);
      },
    );

    // implementation code
    const client = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });
    const actual = await client.put(input).promise();

    expect(actual).toStrictEqual(expected);
  });
});
