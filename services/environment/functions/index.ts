import type { AWS } from "@serverless/typescript"

export const functions: AWS["functions"] = {
  getSecrets: {
    handler: "functions/getSecrets/handler.handler",
    events: [
      {
        httpApi: {
          method: "GET",
          path: "{env}/secrets",
        },
      },
    ],
  },
  addSecret: {
    handler: "functions/addSecret/handler.handler",
    events: [
      {
        httpApi: {
          method: "POST",
          path: "{env}/secrets?key={secretKey}&value={secretValue}",
        },
      },
    ],
  },
  deleteSecret: {
    handler: "functions/deleteSecret/handler.handler",
    events: [
      {
        httpApi: {
          method: "DELETE",
          path: "{env}/secrets/{secretKey}",
        },
      },
    ],
  },
}
