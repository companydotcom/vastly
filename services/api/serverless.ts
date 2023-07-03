import type { AWS } from "@serverless/typescript";
import { functions } from "./functions";

const serverlessConfiguration: AWS = {
  service: "vastly",
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
      target: "node16",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      VastlyApi: {
        Type: "AWS::ApiGateway::RestApi",
        Properties: {
          Name: "VastlyApi",
        },
      },
      VastlyWsApi: {
        Type: "AWS::ApiGatewayV2::Api",
        Properties: {
          Name: "VastlyWsApi",
          ProtocolType: "WEBSOCKET",
          RouteSelectionExpression: "$request.body.action",
        },
      },
    },
    Outputs: {
      VastlyApiRestId: {
        Value: { Ref: "VastlyApi" },
        Export: { Name: "ApiRestId" },
      },
      VastlyApiRootResourceId: {
        Value: { "Fn::GetAtt": ["VastlyApi", "RootResourceId"] },
        Export: { Name: "ApiRootResourceId" },
      },
      VastlyApiWsId: {
        Value: { Ref: "VastlyWsApi" },
        Export: { Name: "ApiWsId" },
      },
      SharedAuthorizerArn: {
        Value: { "Fn::GetAtt": ["AuthLambdaFunction", "Arn"] },
        Export: {
          Name: "SharedAuthorizerArn",
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
