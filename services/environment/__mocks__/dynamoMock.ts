import { vi } from "vitest";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export function setupDynamoMock(mock: DynamoDBDocument) {
  const putMock = vi.fn().mockImplementation(() => ({
    $metadata: {
      httpStatusCode: 200,
      attempts: 1,
      totalRetryDelay: 0,
    },
  }));
  const deleteMock = vi.fn().mockImplementation(() => ({
    $metadata: {
      httpStatusCode: 200,
      attempts: 1,
      totalRetryDelay: 0,
    },
  }));
  const pullMock = vi.fn().mockImplementation(() => ({
    Items: [
      {
        keyValue: "12345",
        environment_keyName: "dev:MY_MOCK1",
      },
      {
        keyValue: "54431",
        environment_keyName: "dev:MY_MOCK2",
      },
      {
        keyValue: "23464",
        environment_keyName: "dev:MY_MOCK#",
      },
    ],
  }));
  const scanMock = vi.fn().mockImplementation(() => ({
    Items: [
      {
        projects: "mockProject1",
      },
      {
        projects: "mockProject1",
      },
      {
        projects: "mockProject2",
      },
      {
        projects: "mockProject3",
      },
    ],
  }));
  mock.put = putMock;
  mock.delete = deleteMock;
  mock.query = pullMock;
  mock.scan = scanMock;
}

export const mockDynamoDBDocument = {} as DynamoDBDocument;
export const mockDynamoDBClient = {} as DynamoDBClient;
