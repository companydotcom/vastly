import type { AWS } from "@serverless/typescript"

export const functions: AWS["functions"] = {
  getSecrets: {
    handler: "functions/get-secrets/handler.handler",
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
        Resource: [
          {
            "Fn::GetAtt": ["SecretsTable", "Arn"],
          },
        ],
      },
    ],
  },
  addSecret: {
    handler: "functions/add-secret/handler.handler",
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
        Resource: [
          {
            "Fn::GetAtt": ["SecretsTable", "Arn"],
          },
        ],
      },
    ],
  },
  deleteSecret: {
    handler: "functions/delete-secret/handler.handler",
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
