import { vi, describe, expect, beforeEach, test } from "vitest";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { addVariable, baseHandler } from "../functions/add/handler";
import { EnvVariable } from "../lib/types";
import { docClient, dynamoClient } from "../lib/dynamodb";
import createEvent from "@serverless/event-mocks";

// mocks docClient and all imports passed to module
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

describe("addEnv Unit Tests", () => {
  describe("addVariable", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    const mockInput: EnvVariable = {
      keyName: "mockKeyName",
      keyValue: "mockKeyValue",
      environment_keyName: "mockEnv:mockKeyName",
      projects: "mockProject1234",
    };

    test("should call addVariable and return a response", async () => {
      const response = await addVariable(mockInput, docClient, dynamoClient);

      expect(docClient.put).toBeCalledTimes(1);
      expect(response).toHaveProperty("$metadata.httpStatusCode");
      expect(response.$metadata.httpStatusCode).toEqual(200);
    });

    test("addVariable throws an error when invalid input is given", async () => {
      await expect(addVariable({}, docClient, dynamoClient)).rejects.toThrow(
        "Error adding to database",
      );
      expect(docClient.put).toBeCalledTimes(1);
    });

    test("should test the mock client through addVariable", async () => {
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

  describe("addEnvHandler", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: types not present for @serverless/event-mocks
    const mockEvent = createEvent({ template: "aws:apiGateway" });

    test("should return 404 if environment is missing", async () => {
      const response = await baseHandler(mockEvent);

      const addVariable = vi.fn();

      expect(response["statusCode"]).toBe(404);
      expect(response["body"]).toContain("Please check your inputs");
      expect(addVariable).not.toHaveBeenCalled();
    });

    test("should return 200 when the correct input is given", async () => {
      const newMockEvent = {
        ...mockEvent,
        body: {
          keyName: "John",
          keyValue: "Doe",
          environment_keyName: "dev:John",
          projects: "mockProject1234",
        },
        pathParameters: { env: "dev" },
      };

      const response = await baseHandler(newMockEvent);

      expect(response["statusCode"]).toBe(200);
      expect(response["body"]).toContain("Variables added successfully");
    });

    test("should return error response when promise is rejected", async () => {
      const newMockEvent = {
        ...mockEvent,
        pathParameters: { env: "dev" },
      };

      const expectedErrorMessage = "Error adding variable ---> Error: Error adding to database";

      vi.spyOn(docClient, "put").mockRejectedValue(new Error(expectedErrorMessage));

      const response = await baseHandler(newMockEvent);

      expect(response.statusCode).toBe(501);
      expect(response.body).toEqual(JSON.stringify({ message: expectedErrorMessage }));
    });
  });
});
