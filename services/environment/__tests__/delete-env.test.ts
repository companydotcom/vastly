import createEvent from "@serverless/event-mocks";
import { deleteVariable, baseHandler } from "../functions/delete/handler";
import { mockDynamoDBDocument, mockDynamoDBClient, setupDynamoMock } from "../__mocks__/dynamoMock";

const mockNewVariable = {
  keyName: "mockKeyName",
  env: "dev",
  projects: "mockProject1234",
};

vi.doMock("@aws-sdk/lib-dynamodb", () => ({
  DynamoDBDocument: vi.fn().mockImplementation(() => mockDynamoDBDocument),
}));

vi.doMock("@aws-sdk/client-dynamodb", () => ({
  DynamoDBClient: vi.fn().mockImplementation(() => mockDynamoDBClient),
}));

describe("Delete Env", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  beforeEach(() => {
    setupDynamoMock(mockDynamoDBDocument);
    mockDynamoDBClient.destroy = vi.fn();
  });

  test("should call deleteVariable with the correct params", async () => {
    const expectedParams = {
      ConditionExpression: "attribute_exists(keyName)",
      TableName: "env",
      Key: {
        environment_keyName: "dev:mockKeyName",
        projects: "mockProject1234",
      },
    };
    const spy = vi.spyOn(mockDynamoDBDocument, "delete");

    await deleteVariable(mockNewVariable, mockDynamoDBDocument, mockDynamoDBClient);

    expect(spy).toHaveBeenCalledWith(expectedParams);
  });

  test("should return the response from deleteVariable", async () => {
    const result = await deleteVariable(mockNewVariable, mockDynamoDBDocument, mockDynamoDBClient);

    expect(result).toHaveProperty("$metadata");
    expect(result.$metadata.httpStatusCode).toEqual(200);
  });

  test("should throw an proper error", async () => {
    const mockError = "Error deleting from database";
    mockDynamoDBDocument.delete = vi.fn().mockRejectedValue(mockError);

    await expect(
      deleteVariable(mockNewVariable, mockDynamoDBDocument, mockDynamoDBClient),
    ).rejects.toThrowError(mockError);
  });

  test("should return 404 if environment is missing", async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: types not present for @serverless/event-mocks
    const mockEvent = createEvent({ template: "aws:apiGateway" });
    const response = await baseHandler({ ...mockEvent, pathParameters: {} });

    const addVariable = vi.fn();

    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.body).message).toContain("Missing env parameter");
    expect(addVariable).not.toHaveBeenCalled();
  });
});
