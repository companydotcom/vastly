import { vi } from "vitest";

// export const awsSdkPromiseResponse = vi.fn().mockReturnValue(Promise.resolve(true));

// const putFn = vi.fn().mockImplementation(() => ({ promise: awsSdkPromiseResponse }));
// const deleteFn = vi.fn().mockImplementation(() => ({ promise: awsSdkPromiseResponse }));

// class DocumentClient {
//   put = putFn;
//   delete = deleteFn;
// }

// export const DynamoDB = {
//   DocumentClient,
// };

const mockDynamoDBDocument = {
  put: vi.fn(),
  get: vi.fn(),
  delete: vi.fn(),
  query: vi.fn(),
  scan: vi.fn(),
  update: vi.fn(),
  batchWrite: vi.fn(),
  transactWrite: vi.fn(),
  transactGet: vi.fn(),
  batchGet: vi.fn(),
};

const mockDynamoDBDocumentConstructor = vi.fn().mockImplementation(() => mockDynamoDBDocument);

export default mockDynamoDBDocumentConstructor;

// const mockDynamoDBDocument = {
//   put: vi.fn(),
// };

// vi.mock("@aws-sdk/lib-dynamodb", () => ({
//   DynamoDBDocument: {
//     put: vi.fn().mockImplementation(() => mockDynamoDBDocument),
//   },
// }));

// export default mockDynamoDBDocument;
