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
  // s3get: {
  //   handler: "functions/s3/get.handler",
  //   description: "Get assets from S3",
  //   events: [
  //     {
  //       http: {
  //         method: "get",
  //         path: "/assets/s3/get/{asset}",
  //         cors: true,
  //         authorizer: {
  //           type: "CUSTOM",
  //           authorizerId: { "Fn::ImportValue": "SharedAuthId" },
  //         },
  //       },
  //     },
  //   ],
  // },
};
