import AWSMock from "aws-sdk-mock";
import AWS from "aws-sdk";
import { vi } from "vitest";

interface Item {
  id: string;
  name: string;
}

interface MockTable {
  Items: Item[]; // in-memory implementation of a DynamoDB table
  put: (params: { Item: Item }, callback: (error: Error | null, result: unknown) => void) => void;
  query: (
    params: { Key: { id: string } },
    callback: (error: Error | null, result: { Item?: Item }) => void,
  ) => void;
  delete: (
    params: { Key: { id: string } },
    callback: (error: Error | null, result: unknown) => void,
  ) => void;
  scan: (
    params: { FilterExpression?: string; ExpressionAttributeValues?: unknown },
    callback: (error: Error | null, result: { Items: Item[] }) => void,
  ) => void;
}

export const mockDocumentClient = () => {
  AWSMock.setSDKInstance(AWS);

  const mockTable: MockTable = {
    Items: [],
    put: vi.fn().mockImplementation((params, callback) => {
      const item = params.Item as Item;
      mockTable.Items.push(item);
      callback(null, "success");
    }),
    query: vi.fn().mockImplementation((params, callback) => {
      const key = params.Key as { id: string };
      const item = mockTable.Items.find((i) => i.id === key.id);
      callback(null, { Item: item });
    }),
    delete: vi.fn().mockImplementation((params, callback) => {
      const key = params.Key as { id: string };
      const index = mockTable.Items.findIndex((i) => i.id === key.id);
      mockTable.Items.splice(index, 1);
      callback(null, "success");
    }),
    scan: vi.fn().mockImplementation((params, callback) => {
      const filteredItems = mockTable.Items.filter((item) => {
        if (params.FilterExpression) {
          const expr = params.FilterExpression;
          expr.attributeValues = params.ExpressionAttributeValues;
          return expr.evaluate(item);
        }
        return true;
      });
      callback(null, { Items: filteredItems });
    }),
  };

  AWSMock.mock("DynamoDB.DocumentClient", "put", mockTable.put);
  AWSMock.mock("DynamoDB.DocumentClient", "query", mockTable.query);
  AWSMock.mock("DynamoDB.DocumentClient", "delete", mockTable.delete);
  AWSMock.mock("DynamoDB.DocumentClient", "scan", mockTable.scan);
};
