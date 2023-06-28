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
          authorizer: "auth",
        },
      },
    ],
  },
  auth: {
    handler: "functions/authorize.handler",
    environment: {
      USER_POOL_ID: {
        "Fn::ImportValue": "PasswordlessMagicLinksUserPoolArn-${self:provider.stage}",
      },
      APP_CLIENT_ID: {
        "Fn::ImportValue": "WebUserPoolClientArn-${self:provider.stage}",
      },
    },
  },
};
