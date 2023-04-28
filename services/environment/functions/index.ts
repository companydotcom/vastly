import type { AWS } from "@serverless/typescript";

export const functions: AWS["functions"] = {
  addEnv: {
    handler: "functions/add/handler.addEnvHandler",
    description: "Add a secret or environment variable",
    events: [
      {
        httpApi: {
          method: "POST",
          path: "/env/{env}",
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
        httpApi: {
          method: "DELETE",
          path: "/env/{env}",
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
  getAllEnv: {
    handler: "functions/pull/handler.getAllEnvHandler",
    description: "Fetch all secrets and variables per environment and project",
    events: [
      {
        httpApi: {
          method: "GET",
          path: "/env/{env}",
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
