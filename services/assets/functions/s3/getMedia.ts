import httpErrorHandler from "@middy/http-error-handler";
import middy from "@middy/core";
import cors from "@middy/http-cors";
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { listOrCreateMediaBucket } from "../../lib/utils";

const { AWS_REGION } = process.env;

const s3GetMedia = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const s3Client = new S3Client({ region: AWS_REGION });
    const project = event?.pathParameters?.waveProjectName as string;

    const { bucketName } = await listOrCreateMediaBucket(s3Client, project);

    const params = {
      Bucket: bucketName,
      Key: event?.pathParameters?.fileName as string,
    };
    const command = new GetObjectCommand(params);
    const data = await s3Client.send(command);
    let result;

    if (!data) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Failed to fetch media",
        }),
      };
    }

    if (data.Body && params.Key.slice(params.Key.length - 4, params.Key.length) === "json") {
      result = await data.Body.transformToString("utf-8");
    } else {
      result = data;
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result),
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
