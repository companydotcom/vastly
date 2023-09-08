import httpErrorHandler from "@middy/http-error-handler";
import middy from "@middy/core";
import cors from "@middy/http-cors";
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { S3Client } from "@aws-sdk/client-s3";
import { listOrCreateMediaBucket, downloadInChunks } from "../../lib";

const { AWS_REGION } = process.env;

// projectName passed through parameters
const s3GetMedia = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const s3Client = new S3Client({ region: AWS_REGION });
    const project = event?.pathParameters?.waveProjectName as string;

    const { bucketName } = await listOrCreateMediaBucket(s3Client, project);

    const params = {
      bucket: bucketName,
      key: event?.pathParameters?.fileName as string,
    };

    await downloadInChunks({ ...params, s3Client });

    return {
      statusCode: 200,
      body: JSON.stringify("Successful fetch of large file"),
    };
  } catch (err) {
    return {
      statusCode: err.$metadata.httpStatusCode,
      body: JSON.stringify({
        message: err.message || "Failed to upload image",
      }),
    };
  }
};

const handler = middy(s3GetMedia).use(cors()).use(httpErrorHandler());

export { handler };
