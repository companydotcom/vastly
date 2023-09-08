import type { AWS } from "@serverless/typescript";
import { functions } from "./functions/index";

const serverlessConfiguration: AWS = {
  service: "assets",
  frameworkVersion: "3.34.0",
  plugins: ["serverless-esbuild", "serverless-offline"],
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
      binaryMediaTypes: ["*/*"],
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
      useChildProcesses: true,
    },
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node18",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      assetServiceRole: {
        Type: "AWS::IAM::Role",
        Properties: {
          RoleName: "AssetServiceRole",
          AssumeRolePolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Principal: {
                  Service: ["lambda.amazonaws.com", "apigateway.amazonaws.com"],
                },
                Action: "sts:AssumeRole",
              },
            ],
          },
          Policies: [
            {
              PolicyName: "AssetServicePolicy",
              PolicyDocument: {
                Version: "2012-10-17",
                Statement: [
                  {
                    Effect: "Allow",
                    Action: "s3:*",
                    Resource: "*",
                  },
                ],
              },
            },
          ],
        },
      },
    },
    Outputs: {
      AssetServiceRoleOutput: {
        Value: { "Fn::GetAtt": ["assetServiceRole", "Arn"] },
        Export: { Name: "AssetServiceRoleArn" },
      },
    },
  },
};

module.exports = serverlessConfiguration;
