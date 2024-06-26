import type { AWS } from "@serverless/typescript"
import { functions as hello } from "./functions"

const serverlessConfiguration: AWS = {
  service: "onboarding",
  frameworkVersion: "3.28.1",
  plugins: ["serverless-esbuild", "serverless-offline"],
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
  functions: { ...hello },
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
}

module.exports = serverlessConfiguration
