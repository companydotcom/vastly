import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
  S3Client,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import httpErrorHandler from "@middy/http-error-handler";
import middy from "@middy/core";
import cors from "@middy/http-cors";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import httpMultipartBodyParser from "@middy/http-multipart-body-parser";
import { listOrCreateMediaBucket } from "../../lib";

const { AWS_REGION } = process.env;

// TODO: incomplete
const initialMultipartUpload = async (event: APIGatewayProxyEvent) => {
  const s3Client = new S3Client({ region: AWS_REGION });
  const project = event?.pathParameters?.waveProjectName as string;
  const fileName = "";

  const { bucketName } = await listOrCreateMediaBucket(s3Client, project);

  const multipartParams = {
    Bucket: bucketName,
    Key: fileName,
    ACL: "public-read",
  };
  const createCommand = new CreateMultipartUploadCommand(multipartParams);
  const { UploadId, Key } = await s3Client.send(createCommand);
  //  need to create a loop to update all parts, look for example
  const uploadParams = {
    Bucket: bucketName,
    Key,
    UploadId,
    PartNumber: 1,
    Body: "PART_DATA", // what is this?
  };

  const uploadPartCommand = new UploadPartCommand(uploadParams);
  const result = await s3Client.send(uploadPartCommand);
  // returns ETag and partyNumber

  // TODO: pivot to single file upload. this can be batch or large file uploader
  return {
    statusCode: 200,
    body: JSON.stringify({
      // fileId: result?.UploadId,
      // fileKey: result?.Key,
    }),
  };
};

const finalizeMultipartUpload = async (event: APIGatewayProxyEvent) => {
  const { fileId, fileKey, parts } = JSON.parse(event?.body ?? "");
  const s3Client = new S3Client({ region: AWS_REGION });

  const multipartParams = {
    Bucket: "",
    Key: fileKey,
    UploadId: fileId,
    MultipartUpload: {
      // make sure they are in the right order
      Parts: parts.sort((a, b) => {
        return a.PartNumber - b.PartNumber;
      }),
    },
  };
  const command = new CompleteMultipartUploadCommand(multipartParams);
  const completeMultipartUploadOutput = await s3Client.send(command);
  // completeMultipartUploadOutput.Location represents the
  // URL to the resource just uploaded to the cloud storage
};

const handler = middy(initialMultipartUpload)
  .use(cors())
  .use(httpErrorHandler())
  .use(httpHeaderNormalizer())
  .use(httpMultipartBodyParser());

export { handler };
