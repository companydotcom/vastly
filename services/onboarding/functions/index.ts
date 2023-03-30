import type { AWS } from "@serverless/typescript"

export const functions: AWS["functions"] = {
  logIn: {
    handler: "functions/log-in/handler.handler",
    events: [
      {
        http: {
          method: "post",
          path: "login",
          cors: true,
        },
      },
    ],
    environment: {
      SES_FROM_ADDRESS: "noreply@${self:custom.domain}",
      KMS_KEY_ID: { Ref: "EncryptionKey" },
      BASE_URL: "ses.companydev.com",
      USER_POOL_ID: { Ref: "PasswordlessMagicLinksUserPool" },
    },
    // @ts-expect-error no types for serverless-iam-roles-per-function
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: "ses:SendEmail",
        Resource: [
          {
            "Fn::Sub":
              "arn:aws:ses:${AWS::Region}:${AWS::AccountId}:identity/${self:custom.domain}",
          },
          { "Fn::Sub": "arn:aws:ses:${AWS::Region}:${AWS::AccountId}:configuration-set/*" },
        ],
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
    ],
  },
  preSignUp: {
    handler: "functions/pre-sign-up/handler.handler",
  },
  defineAuthChallenge: {
    handler: "functions/define-auth-challenge/handler.handler",
  },
  createAuthChallenge: {
    handler: "functions/create-auth-challenge/handler.handler",
  },
  verifyAuthChallengeResponse: {
    handler: "functions/verify-auth-challenge-response/handler.handler",
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
}
