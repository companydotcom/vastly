import type { AWS } from "@serverless/typescript";

export const functions: AWS["functions"] = {
  s3upload: {
    handler: "functions/s3/uploadMedia.handler",
    description: "Upload assets to S3",
    events: [
      {
        http: {
          method: "post",
          path: "/assets/s3/upload/{waveProjectName}",
          cors: true,
          authorizer: {
            type: "CUSTOM",
            authorizerId: { "Fn::ImportValue": "SharedAuthId" },
          },
        },
      },
    ],
  },
  // s3update: {
  //   handler: "functions/s3/update.handler",
  //   description: "Upload assets from S3",
  //   events: [
  //     {
  //       http: {
  //         method: "put",
  //         path: "/assets/s3/update",
  //         cors: true,
  //         authorizer: {
  //           type: "CUSTOM",
  //           authorizerId: { "Fn::ImportValue": "SharedAuthId" },
  //         },
  //       },
  //     },
  //   ],
  // },
  s3getMedia: {
    handler: "functions/s3/getMedia.handler",
    description: "Get assets from S3",
    events: [
      {
        http: {
          method: "get",
          path: "/assets/s3/get/{waveProjectName}/{assetType}",
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
