import AWSMock from "aws-sdk-mock";
import AWS from "aws-sdk";
import { describe, afterEach, it, expect, beforeAll } from "vitest";
import { PutItemOutput } from "@aws-sdk/client-dynamodb";

describe("Add env tests", () => {
  beforeAll(() => {
    AWSMock.setSDKInstance(AWS);
  });

  afterEach(() => {
    AWSMock.restore("DynamoDB");
  });

  it("should add an item to the table", async () => {
    const mockData = {
      TableName: "mockTable",
      Item: {
        id: { S: "123" },
      },
    };

    AWSMock.mock("DynamoDB", "putItem", (params, callback) => {
      const expected: PutItemOutput = {
        ConsumedCapacity: {
          CapacityUnits: 1,
          TableName: mockData.TableName,
        },
      };
      callback(undefined, expected);
    });

    const dynamodb = new AWS.DynamoDB({});
    const params = {
      TableName: "mockTable",
      Item: {
        id: { S: "123" },
      },
    };

    const result = await dynamodb.putItem(params).promise();
    expect(result).toEqual({
      ConsumedCapacity: {
        CapacityUnits: 1,
        TableName: mockData.TableName,
      },
    });
  });
});
