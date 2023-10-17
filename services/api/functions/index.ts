import type { AWS } from "@serverless/typescript";

export const functions: AWS["functions"] = {
  auth: {
    handler: "functions/authorize.handler",
    environment: {
      USER_POOL_ID: {
        "Fn::ImportValue": "PasswordlessMagicLinksUserPoolArn-${self:provider.stage}",
      },
      APP_CLIENT_ID: {
        "Fn::ImportValue": "WebUserPoolClientArn-${self:provider.stage}",
      },
    },
    // @ts-expect-error no types for serverless-iam-roles-per-function
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: "dynamodb:GetItem",
        Resource: "arn:aws:dynamodb:*:*:table/User",
      },
      {
        Effect: "Allow",
        Action: "cognito-idp:AdminGetUser",
        Resource: {
          "Fn::Sub":
            "arn:aws:cognito-idp:${self:provider.region}:${AWS::AccountId}:userpool/${cf:onboarding-${sls:stage}.PasswordlessMagicLinksUserPoolArn}",
        },
      },
    ],
  },
};
