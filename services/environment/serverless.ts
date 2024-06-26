import type { AWS } from "@serverless/typescript";
import { functions } from "./functions";

const serverlessConfiguration: AWS = {
  service: "environment",
  frameworkVersion: "3.34.0",
  plugins: ["serverless-esbuild", "serverless-offline", "serverless-iam-roles-per-function"],
  provider: {
    name: "aws",
    runtime: "nodejs16.x",
    stage: "prod",
    region: "us-east-1",
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
    deploymentMethod: "direct",
    apiGateway: {
      restApiId: {
        "Fn::ImportValue": "ApiRestId",
      },
      restApiRootResourceId: {
        "Fn::ImportValue": "ApiRootResourceId",
      },
      websocketApiId: {
        "Fn::ImportValue": "ApiWsId",
      },
    },
  },
  functions: { ...functions },
  package: { individually: true },
  custom: {
    domain: "api.vastly.is",
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
      EnvTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "env",
          KeySchema: [
            {
              AttributeName: "keyName",
              KeyType: "HASH",
            },
            {
              AttributeName: "keyValue",
              KeyType: "RANGE",
            },
          ],
          AttributeDefinitions: [
            {
              AttributeName: "keyName",
              AttributeType: "S",
            },
            {
              AttributeName: "keyValue",
              AttributeType: "S",
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
      EnvTableArn: {
        Description: "The ARN for the Env Table",
        Value: { "Fn::GetAtt": ["EnvTable", "Arn"] },
        Export: {
          Name: "${self:service}:${sls:stage}:EnvTableArn",
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
