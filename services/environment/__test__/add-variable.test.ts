import { vi, describe, it, expect, beforeEach, test } from "vitest";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { addVariable } from "../functions/add/handler";
import { EnvVariable } from "../lib/types";
import { docClient, dynamoClient } from "../lib/dynamodb";

// docClient mock
vi.mock("../lib/dynamodb", async (importOriginal: () => Promise<typeof DynamoDBDocument>) => {
  const module = await importOriginal();
  const mock = {
    put: vi.fn().mockImplementation((arg) => {
      if (!arg.Item.keyName) {
        throw Error();
      }
      return {
        $metadata: {
          httpStatusCode: 200,
          attempts: 1,
          totalRetryDelay: 0,
        },
      };
    }),
  };
  return {
    ...module,
    docClient: {
      put: mock.put,
    },
  };
});

describe("addVariable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockInput = {
    keyName: "mockKeyName",
    keyValue: "mockKeyValue",
    environment_keyName: "mockEnv:mockKeyName",
    projects: "mockProject1234",
  };

  test("should call addVariable and return a response", async () => {
    const response = await addVariable(mockInput as EnvVariable, docClient, dynamoClient);

    expect(docClient.put).toBeCalledTimes(1);
    expect(response).toHaveProperty("$metadata.httpStatusCode");
    expect(response.$metadata.httpStatusCode).toEqual(200);
  });

  test("addVariable throws an error when dynamoDoc.put() fails", async () => {
    await expect(addVariable({}, docClient, dynamoClient)).rejects.toThrow(
      "Error adding to database",
    );
    expect(docClient.put).toBeCalledTimes(1);
  });

  it("should test the mock client through addVariable", async () => {
    const expectedParams = {
      TableName: "env",
      Item: mockInput,
    };

    await addVariable(mockInput as EnvVariable, docClient, dynamoClient);

    expect(vi.mocked(docClient)).toHaveProperty("put");
    expect(vi.mocked(docClient.put)).toHaveBeenCalledWith(expectedParams);
    expect(vi.mocked(docClient.put)).toHaveBeenCalledOnce();
  });
});
