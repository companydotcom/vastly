import type { AWS } from "@serverless/typescript";

export const functions: AWS["functions"] = {
  helloWorld: {
    handler: "functions/hello-world.handler",
  },
};
