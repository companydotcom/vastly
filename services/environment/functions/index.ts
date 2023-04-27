import type { AWS } from "@serverless/typescript";

export const functions: AWS["functions"] = {
  addEnv: {
    handler: "functions/add/handler.addEnvHandler",
    description: "Add a secret or environment variable",
    events: [
      {
        httpApi: {
          method: "POST",
          path: "/{env}/env",
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
  deleteEnv: {
    handler: "functions/delete/handler.deleteEnvHandler",
    description: "Delete a secret or environment variable",
    events: [
      {
        httpApi: {
          method: "DELETE",
          path: "/{env}/env",
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
  getAllSecrets: {
    handler: "functions/get-secrets/handler.getAllSecretsHandler",
    description: "Fetch all secrets per environment",
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
        Action: "dynamodb:PutItem",
        Resource: [
          {
            "Fn::GetAtt": ["SecretsTable", "Arn"],
          },
        ],
      },
    ],
  },
};
