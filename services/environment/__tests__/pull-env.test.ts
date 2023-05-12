import createEvent from "@serverless/event-mocks";
import { baseHandler, getAllEnv, getAllProjects, getKeyNames } from "../functions/pull/handler";
import { mockDynamoDBDocument, mockDynamoDBClient, setupDynamoMock } from "../__mocks__/dynamoMock";
import { QueryCommandInput } from "@aws-sdk/lib-dynamodb";

const mockNewVariable = {
  env: "dev",
  project: "mockProject1234",
};

vi.doMock("@aws-sdk/lib-dynamodb", () => ({
  DynamoDBDocument: vi.fn().mockImplementation(() => mockDynamoDBDocument),
}));

vi.doMock("@aws-sdk/client-dynamodb", () => ({
  DynamoDBClient: vi.fn().mockImplementation(() => mockDynamoDBClient),
}));

describe("Pull Env", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  beforeEach(() => {
    setupDynamoMock(mockDynamoDBDocument);
    mockDynamoDBClient.destroy = vi.fn();
  });

  test("should return 404 if environment is missing", async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: types not present for @serverless/event-mocks
    const mockEvent = createEvent({ template: "aws:apiGateway" });
    const response = await baseHandler({ ...mockEvent, pathParameters: {} });

    const getAllEnv = vi.fn();

    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.body).message).toContain("Missing env parameter");
    expect(getAllEnv).not.toHaveBeenCalled();
  });

  describe("getAllEnv", () => {
    test("should call getAllEnv with the correct params", async () => {
      const expectedParams: QueryCommandInput = {
        TableName: "env",
        KeyConditionExpression: "projects = :project and begins_with(environment_keyName, :env)",
        ExpressionAttributeValues: { ":project": "mockProject1234", ":env": "dev:" },
        ProjectionExpression: "environment_keyName, keyValue",
      };

      await getAllEnv(mockNewVariable, mockDynamoDBDocument, mockDynamoDBClient);

      expect(mockDynamoDBDocument.query).toHaveBeenCalledWith(expectedParams);
    });

    test("should return the response from getAllEnv", async () => {
      const result = await getAllEnv(mockNewVariable, mockDynamoDBDocument, mockDynamoDBClient);

      expect(result?.[0]).toHaveProperty("keyValue");
      expect(result?.[0]).toHaveProperty("environment_keyName");
    });

    test("should throw an proper error", async () => {
      const mockError = "Error fetching variables";
      mockDynamoDBDocument.query = vi.fn().mockRejectedValue(mockError);

      await expect(
        getAllEnv(mockNewVariable, mockDynamoDBDocument, mockDynamoDBClient),
      ).rejects.toThrowError(mockError);
    });
  });

  describe("getAllProjects", () => {
    test("should call getAllProjects with the correct params", async () => {
      const expectedParams: QueryCommandInput = {
        TableName: "env",
        ProjectionExpression: "projects",
        Select: "SPECIFIC_ATTRIBUTES",
      };

      await getAllProjects(mockDynamoDBDocument, mockDynamoDBClient);

      expect(mockDynamoDBDocument.scan).toHaveBeenCalledOnce();
      expect(mockDynamoDBDocument.scan).toHaveBeenCalledWith(expectedParams);
    });

    test("should return the response from getAllProjects", async () => {
      const result = await getAllProjects(mockDynamoDBDocument, mockDynamoDBClient);

      expectTypeOf(result).toBeArray();
      expectTypeOf(result[0]).toBeString();
    });

    test("should throw an proper error", async () => {
      const mockError = "Error fetching projects";
      mockDynamoDBDocument.scan = vi.fn().mockRejectedValue(mockError);

      await expect(getAllProjects(mockDynamoDBDocument, mockDynamoDBClient)).rejects.toThrowError(
        mockError,
      );
    });
  });

  describe("getKeyNames", () => {
    beforeEach(() => {
      // Overwriting original mock for this case
      mockDynamoDBDocument.query = vi.fn().mockImplementationOnce(() => ({
        Items: [
          {
            environment_keyName: "dev:mockProject111",
          },
          {
            environment_keyName: "dev:mockProject222",
          },
          {
            environment_keyName: "dev:mockProject333",
          },
        ],
      }));
    });

    test("should call getKeyNames with the correct params", async () => {
      const expectedParams = {
        TableName: "env",
        KeyConditionExpression: "projects = :project and begins_with(environment_keyName, :env)",
        ExpressionAttributeValues: {
          ":project": mockNewVariable.project,
          ":env": `${mockNewVariable.env}:`,
        },
        ProjectionExpression: "environment_keyName",
      };

      await getKeyNames(mockNewVariable, mockDynamoDBDocument, mockDynamoDBClient);

      expect(mockDynamoDBDocument.query).toHaveBeenCalledOnce();
      expect(mockDynamoDBDocument.query).toHaveBeenCalledWith(expectedParams);
    });

    test("should return the response from getKeyNames", async () => {
      const result = await getKeyNames(mockNewVariable, mockDynamoDBDocument, mockDynamoDBClient);

      expectTypeOf(result).toBeArray();
      expectTypeOf(result[0]).toBeString();
    });

    test("should throw an proper error", async () => {
      const mockError = "Error fetching keys";
      mockDynamoDBDocument.query = vi.fn().mockRejectedValue(mockError);

      await expect(
        getKeyNames(mockNewVariable, mockDynamoDBDocument, mockDynamoDBClient),
      ).rejects.toThrowError(mockError);
    });
  });
});
