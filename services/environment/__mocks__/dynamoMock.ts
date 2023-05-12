import { MockedFunction, vi } from "vitest";
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

type MockFn<Input, Output> = MockedFunction<(input: Input) => Output>;

export function setupDynamoMock(mock: DynamoDBDocument): DynamoDBDocument {
  const putMock: MockFn<PutCommandInput, Promise<PutCommandOutput>> = vi
    .fn()
    .mockImplementation((_args) => {
      return {
        $metadata: {
          httpStatusCode: 200,
          attempts: 1,
          totalRetryDelay: 0,
        },
      };
    });
  const deleteMock: MockFn<DeleteCommandInput, Promise<DeleteCommandOutput>> = vi
    .fn()
    .mockImplementation((_args) => {
      return {
        $metadata: {
          httpStatusCode: 200,
          attempts: 1,
          totalRetryDelay: 0,
        },
      };
    });
  const pullMock: MockFn<QueryCommandInput, Promise<QueryCommandOutput>> = vi
    .fn()
    .mockImplementation((_args) => {
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
  const scanMock: MockFn<ScanCommandInput, Promise<ScanCommandOutput>> = vi
    .fn()
    .mockImplementation((_args) => {
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

  return mock;
}

export const mockDynamoDBDocument = {} as DynamoDBDocument;
export const mockDynamoDBClient = {} as DynamoDBClient;
