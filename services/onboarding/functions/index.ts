import type { AWS } from "@serverless/typescript";

export const functions: AWS["functions"] = {
  logIn: {
    handler: "functions/log-in.handler",
    events: [
      {
        http: {
          method: "post",
          path: "/onboarding/login",
          cors: true,
        },
      },
    ],
    environment: {
      SES_FROM_ADDRESS: "noreply@${self:custom.domain}",
      KMS_KEY_ID: { Ref: "EncryptionKey" },
      USER_POOL_ID: { Ref: "PasswordlessMagicLinksUserPool" },
    },
    // @ts-expect-error no types for serverless-iam-roles-per-function
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: "ses:SendEmail",
        Resource: "*",
      },
      {
        Effect: "Allow",
        Action: "kms:Encrypt",
        Resource: {
          "Fn::GetAtt": ["EncryptionKey", "Arn"],
        },
      },
      {
        Effect: "Allow",
        Action: "cognito-idp:AdminUpdateUserAttributes",
        Resource: {
          "Fn::GetAtt": ["PasswordlessMagicLinksUserPool", "Arn"],
        },
      },
      {
        Effect: "Allow",
        Action: "cognito-idp:AdminGetUser",
        Resource: {
          "Fn::GetAtt": ["PasswordlessMagicLinksUserPool", "Arn"],
        },
      },
    ],
  },
  verify: {
    handler: "functions/verify.handler",
    events: [
      {
        http: {
          method: "post",
          path: "/onboarding/verify",
          cors: true,
        },
      },
    ],
    environment: {
      APP_CLIENT_ID: { Ref: "WebUserPoolClient" },
      USER_POOL_ID: { Ref: "PasswordlessMagicLinksUserPool" },
    },
  },
  logOut: {
    handler: "functions/log-out.handler",
    events: [
      {
        http: {
          method: "post",
          path: "/onboarding/logout",
          cors: true,
        },
      },
    ],
  },
  preSignUp: {
    handler: "functions/pre-sign-up.handler",
  },
  defineAuthChallenge: {
    handler: "functions/define-auth-challenge.handler",
  },
  createAuthChallenge: {
    handler: "functions/create-auth-challenge.handler",
  },
  preTokenGeneration: {
    handler: "functions/pre-token-generation.handler",
    // @ts-expect-error no types for serverless-iam-roles-per-function
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: "dynamodb:GetItem",
        Resource: [
          {
            "Fn::GetAtt": ["UserTable", "Arn"],
          },
        ],
      },
    ],
  },
  verifyAuthChallengeResponse: {
    handler: "functions/verify-auth-challenge-response.handler",
    environment: {
      KMS_KEY_ID: { Ref: "EncryptionKey" },
    },
    // @ts-expect-error no types for serverless-iam-roles-per-function
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: "kms:Decrypt",
        Resource: [
          {
            "Fn::GetAtt": ["EncryptionKey", "Arn"],
          },
        ],
      },
    ],
    iamRoleStatementsName: "${self:service}-${sls:stage}-verifyAuthChallengeResponse",
  },
};
