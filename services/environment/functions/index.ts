import type { AWS } from "@serverless/typescript"

export const functions: AWS["functions"] = {
  getSecrets: {
    handler: "functions/getSecrets/handler.handler",
    description: "Get all secrets",
    events: [
      {
        httpApi: {
          method: "GET",
          path: "/{env}/secrets",
        },
      },
    ],
    // @ts-expect-error no types for serverless-iam-roles-per-function
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: "dynamodb:Query",
        Resource: "*",
      },
    ],
  },
  addSecret: {
    handler: "functions/addSecret/handler.handler",
    description: "Add a secret",
    events: [
      {
        httpApi: {
          method: "POST",
          path: "/{env}/secrets",
        },
      },
    ],
    // @ts-expect-error no types for serverless-iam-roles-per-function
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: "dynamodb:PutItem",
        Resource: "*",
      },
    ],
  },
  deleteSecret: {
    handler: "functions/deleteSecret/handler.handler",
    events: [
      {
        httpApi: {
          method: "DELETE",
          path: "/{env}/secrets",
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
            "Fn::GetAtt": ["SecretsTable", "Arn"],
          },
        ],
      },
    ],
  },
}
