import { vi } from "vitest";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export function setupPutMock(mock: DynamoDBDocument) {
  const putMock = vi.fn().mockImplementation(() => ({
    $metadata: {
      httpStatusCode: 200,
      attempts: 1,
      totalRetryDelay: 0,
    },
  }));
  mock.put = putMock;
}

export const mockDynamoDBDocument = {} as DynamoDBDocument;
export const mockDynamoDBClient = {} as DynamoDBClient;
