import type { AWS } from "@serverless/typescript";

export const functions: AWS["functions"] = {
  getUser: {
    handler: "functions/get-user.handler",
    events: [
      {
        http: {
          method: "get",
          path: "/user",
          cors: true,
          authorizer: "${cf:vastly-${self:provider.stage}.SharedAuthorizerArn}",
        },
      },
    ],
  },
};
