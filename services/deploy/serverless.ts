import type { AWS } from "@serverless/typescript";
import { functions } from "./../deploy/functions/index";

const serverlessConfiguration: AWS = {
  service: "deploy",
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
    sharedAuthorizer: {
      "Fn::ImportValue": "SharedAuthorizerArn",
    },
  },
  resources: {
    Resources: {
      deployAssumeRole: {
        Type: "AWS::IAM::Role",
        Properties: {
          RoleName: "DeployAssumeRole",
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
              PolicyName: "SSTDeployPolicy",
              PolicyDocument: {
                Version: "2012-10-17",
                Statement: [
                  {
                    Effect: "Allow",
                    Action: ["cloudformation:*", "s3:*", "iam:*", "lambda:*", "ecr:*", "ssm:*"],
                    Resource: ["*"],
                  },
                ],
              },
            },
          ],
        },
      },
    },
    Outputs: {
      DeployAssumeRoleOutput: {
        Value: { Ref: "deployAssumeRole" },
        Export: { Name: "DeployAssumeRoleArn-${self:provider.stage}" },
      },
    },
  },
};

module.exports = serverlessConfiguration;
