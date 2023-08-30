import type { AWS } from "@serverless/typescript";

export const functions: AWS["functions"] = {
  deployFrontend: {
    handler: "functions/frontend.handler",
    description: "Frontend deployment",
    events: [
      {
        http: {
          method: "post",
          path: "/deploy/{account_Id}",
          cors: true,
          authorizer: {
            type: "CUSTOM",
            authorizerId: { "Fn::ImportValue": "SharedAuthId" },
          },
        },
      },
    ],
  },
};
