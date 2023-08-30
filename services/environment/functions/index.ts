import type { AWS } from "@serverless/typescript";

export const functions: AWS["functions"] = {
  addEnv: {
    handler: "functions/add/handler.addEnvHandler",
    description: "Add a secret or environment variable",
    events: [
      {
        http: {
          method: "post",
          path: "/env/{env}",
          cors: true,
          authorizer: {
            type: "CUSTOM",
            authorizerId: { "Fn::ImportValue": "SharedAuthId" },
          },
        },
      },
    ],
    // @ts-expect-error no types for serverless-iam-roles-per-function
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: "dynamodb:PutItem",
        Resource: [
          {
            "Fn::GetAtt": ["EnvTable", "Arn"],
          },
        ],
      },
    ],
  },
  deleteEnv: {
    handler: "functions/delete/handler.deleteEnvHandler",
    description: "Delete a secret or environment variable",
    events: [
      {
        http: {
          method: "delete",
          path: "/env/{env}",
          cors: true,
          authorizer: {
            type: "CUSTOM",
            authorizerId: { "Fn::ImportValue": "SharedAuthId" },
          },
        },
      },
    ],
    // @ts-expect-error no types for serverless-iam-roles-per-function
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: "dynamodb:DeleteItem",
        Resource: [
          {
            "Fn::GetAtt": ["EnvTable", "Arn"],
          },
        ],
      },
    ],
  },
  getAllEnv: {
    handler: "functions/pull/handler.getAllEnvHandler",
    description: "Fetch all secrets and variables per environment and project",
    events: [
      {
        http: {
          method: "get",
          path: "/env/{env}",
          cors: true,
          authorizer: {
            type: "CUSTOM",
            authorizerId: { "Fn::ImportValue": "SharedAuthId" },
          },
        },
      },
    ],
    // @ts-expect-error no types for serverless-iam-roles-per-function
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: "dynamodb:Query",
        Resource: [
          {
            "Fn::GetAtt": ["EnvTable", "Arn"],
          },
        ],
      },
      {
        Effect: "Allow",
        Action: "dynamodb:Scan",
        Resource: [
          {
            "Fn::GetAtt": ["EnvTable", "Arn"],
          },
        ],
      },
    ],
  },
};
