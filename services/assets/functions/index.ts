import type { AWS } from "@serverless/typescript";

export const functions: AWS["functions"] = {
  s3upload: {
    handler: "functions/s3/upload-media.handler",
    description: "Upload assets to S3",
    events: [
      {
        http: {
          method: "post",
          path: "/assets/s3/upload/{clientName}",
          cors: true,
          authorizer: {
            type: "CUSTOM",
            authorizerId: { "Fn::ImportValue": "SharedAuthId" },
          },
        },
      },
    ],
  },
  s3update: {
    handler: "functions/s3/update-media.handler",
    description: "Archive assets in S3",
    events: [
      {
        http: {
          method: "put",
          path: "/assets/s3/update/{clientName}",
          cors: true,
          authorizer: {
            type: "CUSTOM",
            authorizerId: { "Fn::ImportValue": "SharedAuthId" },
          },
        },
      },
    ],
  },
  s3getMedia: {
    handler: "functions/s3/get-media.handler",
    description: "Get assets from S3",
    events: [
      {
        http: {
          method: "get",
          path: "/assets/s3/get/{clientName}",
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
