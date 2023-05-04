import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
// import { vi } from 'vitest';

export const mockAPIEvent = {
  body: JSON.stringify({
    keyName: "keyName",
    keyValue: "keyValue",
    environment_keyName: "test:keyName",
    projects: "project1",
  }),
  headers: {
    "Content-Type": "application/json",
  },
  isBase64Encoded: false,
  rawPath: "/",
  rawQueryString: "",
  requestContext: {
    accountId: "",
    apiId: "",
    domainName: "",
    domainPrefix: "",
    http: {
      method: "POST",
      path: "/",
      protocol: "HTTP/1.1",
      sourceIp: "",
      userAgent: "",
    },
    requestId: "",
    routeKey: "",
    stage: "",
    time: "",
    timeEpoch: 0,
  },
  routeKey: "",
  version: "",
};

export const mockDynamo = () => {
  const dynamoClient = new DynamoDBClient({ region: "us-1-east" });
  const dynamoDocClient = DynamoDBDocumentClient.from(dynamoClient);
  const mock = mockClient(dynamoDocClient);
  return {
    mockDynamoDB: mock,
    dynamoDestroy: dynamoClient.destroy(),
    dynamoSend: mock.send,
  };
};

// vi.mock('@aws-sdk/lib-dynamodb', () => {
//   return {
//     DynamoDBDocumentClient: {
//       from: vi.fn().mockImplementation(() => {
//         return {
//           send: vi.fn().mockImplementation((command) => {
//             let res = 'something';
//             if(command.name == 'GetCommand'){
//                res = 'something else (a constant from earlier...)';
//             }
//             /* return whatever needs to be returned... */
//             return Promise.resolve(res);
//           }),
//         };
//       }),
//     },
//     /* Return your other docClient methods here too... */
//     GetCommand: vi.fn().mockImplementation(() => {
//       return { name: 'GetCommand' };
//     }),
//   };
// });
