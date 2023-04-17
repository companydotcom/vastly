import type { AWS } from "@serverless/typescript"
import { functions } from "./functions"

const serverlessConfiguration: AWS = {
  service: "environment-srvc",
  frameworkVersion: "3",
  plugins: [
    "serverless-esbuild",
    "serverless-offline",
    "serverless-dynamodb-local",
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
    httpApi: {
      cors: true,
    },
  },
  functions: { ...functions },
  package: { individually: true },
  custom: {
    "serverless-offline": {
      httpPort: 4000,
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
      SecretsTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "secrets",
          AttributeDefinitions: [
            {
              AttributeName: "environment",
              AttributeType: "S",
            },
            {
              AttributeName: "secretKey",
              AttributeType: "S",
            },
          ],
          KeySchema: [
            {
              AttributeName: "environment",
              KeyType: "HASH",
            },
            {
              AttributeName: "secretKey",
              KeyType: "RANGE",
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      },
    },
    // The "Outputs" that your AWS CloudFormation Stack should produce.
    Outputs: {
      SecretsTableArn: {
        Description: "The ARN for the Secrets Table",
        Value: { "Fn::GetAtt": ["SecretsTable", "Arn"] },
        Export: {
          Name: "${self:service}:${sls:stage}:SecretsTableArn",
        },
      },
    },
  },
}

module.exports = serverlessConfiguration
