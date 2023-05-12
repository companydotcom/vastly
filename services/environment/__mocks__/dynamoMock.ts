import { vi } from "vitest";
import type { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import type {
  DeleteCommandInput,
  DeleteCommandOutput,
  DynamoDBDocument,
  PutCommandInput,
  PutCommandOutput,
  QueryCommandInput,
  QueryCommandOutput,
  ScanCommandInput,
  ScanCommandOutput,
} from "@aws-sdk/lib-dynamodb";

export function setupDynamoMock(mock: DynamoDBDocument) {
  const putMock = vi.fn().mockImplementation((_args: PutCommandInput): PutCommandOutput => {
    return {
      $metadata: {
        httpStatusCode: 200,
        attempts: 1,
        totalRetryDelay: 0,
      },
    };
  });
  const deleteMock = vi
    .fn()
    .mockImplementation((_args: DeleteCommandInput): DeleteCommandOutput => {
      return {
        $metadata: {
          httpStatusCode: 200,
          attempts: 1,
          totalRetryDelay: 0,
        },
      };
    });
  const pullMock = vi.fn().mockImplementation((_args: QueryCommandInput): QueryCommandOutput => {
    return {
      $metadata: {},
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
    };
  });
  const scanMock = vi.fn().mockImplementation((_args: ScanCommandInput): ScanCommandOutput => {
    return {
      $metadata: {},
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
    };
  });
  mock.put = putMock;
  mock.delete = deleteMock;
  mock.query = pullMock;
  mock.scan = scanMock;
}

export const mockDynamoDBDocument = {} as DynamoDBDocument;
export const mockDynamoDBClient = {} as DynamoDBClient;
