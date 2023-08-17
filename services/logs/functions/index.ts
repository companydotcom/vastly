import type { AWS } from "@serverless/typescript";

export const functions: AWS["functions"] = {
  getLambdaLogs: {
    handler: "functions/cloud-watch/get-lambda-logs.ts",
  },
  getDeploymentLogs: {
    handler: "functions/deployments/get-deployment-logs.ts",
  },
};
