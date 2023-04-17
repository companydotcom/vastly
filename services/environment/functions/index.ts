import type { AWS } from "@serverless/typescript"

export const functions: AWS["functions"] = {
  addSecret: {
    handler: "functions/add-secret/handler.addSecretHandler",
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
}
