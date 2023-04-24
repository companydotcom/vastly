import type { AWS } from "@serverless/typescript";
import { functions } from "./functions";

const serverlessConfiguration: AWS = {
  service: "onboarding",
  frameworkVersion: "3.28.1",
  plugins: [
    "serverless-esbuild",
    "serverless-offline",
    "serverless-offline-kms",
    "serverless-iam-roles-per-function",
  ],
  provider: {
    name: "aws",
    runtime: "nodejs16.x",
    stage: "dev",
    region: "us-east-1",
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
    deploymentMethod: "direct",
  },
  functions: { ...functions },
  package: { individually: true },
  custom: {
    domain: "ses.companydev.com",
    "serverless-offline": {
      httpPort: 4000,
      useChildProcesses: true,
    },
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node16",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      PasswordlessMagicLinksUserPool: {
        Type: "AWS::Cognito::UserPool",
        Properties: {
          UsernameConfiguration: {
            CaseSensitive: false,
          },
          UsernameAttributes: ["email"],
          Policies: {
            // this is only to satisfy Cognito requirements
            // we won't be using passwords, but we also don't
            // want weak passwords in the system ;-)
            PasswordPolicy: {
              MinimumLength: 16,
              RequireLowercase: true,
              RequireNumbers: true,
              RequireUppercase: true,
              RequireSymbols: true,
            },
          },
          Schema: [
            {
              AttributeDataType: "String",
              Mutable: false,
              Required: true,
              Name: "email",
              StringAttributeConstraints: {
                MinLength: "8",
              },
            },
            {
              AttributeDataType: "String",
              Mutable: true,
              Required: false,
              Name: "authChallenge",
              StringAttributeConstraints: {
                MinLength: "8",
              },
            },
          ],
          LambdaConfig: {
            PreSignUp: { "Fn::GetAtt": ["PreSignUpLambdaFunction", "Arn"] },
            DefineAuthChallenge: { "Fn::GetAtt": ["DefineAuthChallengeLambdaFunction", "Arn"] },
            CreateAuthChallenge: { "Fn::GetAtt": ["CreateAuthChallengeLambdaFunction", "Arn"] },
            VerifyAuthChallengeResponse: {
              "Fn::GetAtt": ["VerifyAuthChallengeResponseLambdaFunction", "Arn"],
            },
            PostAuthentication: {
              "Fn::GetAtt": ["PostAuthenticationLambdaFunction", "Arn"],
            },
          },
        },
      },
      WebUserPoolClient: {
        Type: "AWS::Cognito::UserPoolClient",
        Properties: {
          ClientName: "web",
          UserPoolId: { Ref: "PasswordlessMagicLinksUserPool" },
          ExplicitAuthFlows: ["ALLOW_CUSTOM_AUTH", "ALLOW_REFRESH_TOKEN_AUTH"],
          PreventUserExistenceErrors: "ENABLED",
        },
      },
      UserPoolPreSignUpLambdaPermission: {
        Type: "AWS::Lambda::Permission",
        Properties: {
          Action: "lambda:invokeFunction",
          Principal: "cognito-idp.amazonaws.com",
          FunctionName: { Ref: "PreSignUpLambdaFunction" },
          SourceArn: { "Fn::GetAtt": ["PasswordlessMagicLinksUserPool", "Arn"] },
        },
      },
      UserPoolPostAuthenticationLambdaPermission: {
        Type: "AWS::Lambda::Permission",
        Properties: {
          Action: "lambda:invokeFunction",
          Principal: "cognito-idp.amazonaws.com",
          FunctionName: { Ref: "PostAuthenticationLambdaFunction" },
          SourceArn: { "Fn::GetAtt": ["PasswordlessMagicLinksUserPool", "Arn"] },
        },
      },
      UserPoolDefineAuthChallengeLambdaPermission: {
        Type: "AWS::Lambda::Permission",
        Properties: {
          Action: "lambda:invokeFunction",
          Principal: "cognito-idp.amazonaws.com",
          FunctionName: { Ref: "DefineAuthChallengeLambdaFunction" },
          SourceArn: { "Fn::GetAtt": ["PasswordlessMagicLinksUserPool", "Arn"] },
        },
      },
      UserPoolCreateAuthChallengeLambdaPermission: {
        Type: "AWS::Lambda::Permission",
        Properties: {
          Action: "lambda:invokeFunction",
          Principal: "cognito-idp.amazonaws.com",
          FunctionName: { Ref: "CreateAuthChallengeLambdaFunction" },
          SourceArn: { "Fn::GetAtt": ["PasswordlessMagicLinksUserPool", "Arn"] },
        },
      },
      UserPoolVerifyAuthChallengeResponseLambdaPermission: {
        Type: "AWS::Lambda::Permission",
        Properties: {
          Action: "lambda:invokeFunction",
          Principal: "cognito-idp.amazonaws.com",
          FunctionName: { Ref: "VerifyAuthChallengeResponseLambdaFunction" },
          SourceArn: { "Fn::GetAtt": ["PasswordlessMagicLinksUserPool", "Arn"] },
        },
      },
      EncryptionKey: {
        Type: "AWS::KMS::Key",
        Properties: {
          Enabled: true,
          EnableKeyRotation: true,
          MultiRegion: false,
          PendingWindowInDays: 7,
          KeyPolicy: {
            Version: "2012-10-17",
            Statement: [
              {
                Sid: "Enable IAM User Permissions",
                Effect: "Allow",
                Principal: {
                  AWS: {
                    "Fn::Sub": "arn:aws:iam::${AWS::AccountId}:root",
                  },
                },
                Action: "kms:*",
                Resource: "*",
              },
              {
                Sid: "Allow access for Key Administrators",
                Effect: "Allow",
                Principal: {
                  AWS: {
                    "Fn::Sub":
                      "arn:aws:iam::${AWS::AccountId}:role/aws-reserved/sso.amazonaws.com/AWSReservedSSO_DeploymentAdmin_aec4cb4b8a3e5bce",
                  },
                },
                Action: [
                  "kms:Create*",
                  "kms:Describe*",
                  "kms:Enable*",
                  "kms:List*",
                  "kms:Put*",
                  "kms:Update*",
                  "kms:Revoke*",
                  "kms:Disable*",
                  "kms:Get*",
                  "kms:Delete*",
                  "kms:TagResource",
                  "kms:UntagResource",
                  "kms:ScheduleKeyDeletion",
                  "kms:CancelKeyDeletion",
                ],
                Resource: "*",
              },
            ],
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
