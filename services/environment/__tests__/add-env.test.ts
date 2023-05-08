import { addVariable, baseHandler } from "../functions/add/handler";
import { EnvVariable } from "../lib/types";
import { mockDynamoDBDocument, mockDynamoDBClient, setupPutMock } from "../__mocks__/dynamoMock";
import createEvent from "@serverless/event-mocks";

const mockNewVariable: EnvVariable = {
  keyName: "mockKeyName",
  keyValue: "mockKeyValue",
  environment_keyName: "mockEnv:mockKeyName",
  projects: "mockProject1234",
};

vi.mock("@aws-sdk/lib-dynamodb", () => ({
  DynamoDBDocument: vi.fn().mockImplementation(() => mockDynamoDBDocument),
}));

vi.mock("@aws-sdk/client-dynamodb", () => ({
  DynamoDBClient: vi.fn().mockImplementation(() => mockDynamoDBClient),
}));

describe("Add Env", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  beforeEach(() => {
    setupPutMock(mockDynamoDBDocument);
    mockDynamoDBClient.destroy = vi.fn();
  });

  test("should call addVariable with the correct params", async () => {
    const expectedParams = {
      TableName: "env",
      Item: mockNewVariable,
    };

    await addVariable(mockNewVariable, mockDynamoDBDocument, mockDynamoDBClient);

    expect(mockDynamoDBDocument.put).toHaveBeenCalledWith(expectedParams);
  });

  test("should return the response from addVariable", async () => {
    const result = await addVariable(mockNewVariable, mockDynamoDBDocument, mockDynamoDBClient);

    expect(result).toHaveProperty("$metadata.httpStatusCode");
    expect(result.$metadata.httpStatusCode).toEqual(200);
  });

  test("should throw an proper error", async () => {
    const mockError = "Error adding to database";
    mockDynamoDBDocument.put = vi.fn().mockRejectedValue(mockError);

    await expect(
      addVariable(mockNewVariable, mockDynamoDBDocument, mockDynamoDBClient),
    ).rejects.toThrowError(mockError);
  });

  test("should return 404 if environment is missing", async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: types not present for @serverless/event-mocks
    const mockEvent = createEvent({ template: "aws:apiGateway" });
    const response = await baseHandler({ ...mockEvent, pathParameters: {} });

    const addVariable = vi.fn();

    expect(response["statusCode"]).toBe(404);
    expect(JSON.parse(response.body).message).toContain("Missing env parameter");
    expect(addVariable).not.toHaveBeenCalled();
  });
});
