import middy from "@middy/core";
import cors from "@middy/http-cors";
import httpErrorHandler from "@middy/http-error-handler";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getMediaBucket, normalizeFilePath, roleChaining } from "../../lib";

const { AWS_REGION } = process.env;

const s3GetMedia = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const filePath = normalizeFilePath(event.queryStringParameters?.["filePath"]);
    const clientName = event.pathParameters?.clientName;

    if (!filePath || !clientName) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Incorrect parameters on request",
        }),
      };
    }

    const { credentials } = await roleChaining();
    const s3Client = new S3Client([
      {
        region: AWS_REGION,
        credentials: {
          accessKeyId: credentials?.AccessKeyId,
          secretAccessKey: credentials?.SecretAccessKey,
          sessionToken: credentials?.SessionToken,
          expiration: credentials?.Expiration,
        },
      },
    ]);

    const { bucketName } = await getMediaBucket(s3Client, clientName, credentials);

    const params = {
      Bucket: bucketName,
      Prefix: `${filePath}/`,
    };

    console.log(`----- Getting contents from S3: ${bucketName}`);
    const command = new ListObjectsV2Command(params);
    const data = await s3Client.send(command);

    if (!data?.Contents) {
      return {
        statusCode: data.$metadata.httpStatusCode ?? 404,
        body: JSON.stringify({
          message: "Failed to fetch media",
        }),
      };
    }

    // Multiple file download
    let media = {};
    const mediaUrl = `https://${bucketName}.s3.amazonaws.com/`;
    if (data.Contents.length > 1) {
      media = data.Contents.map((file) => {
        return { fileName: file.Key, url: mediaUrl + file.Key, ETag: file.ETag };
      });
    } else {
      media = {
        fileName: data.Contents[0].Key,
        url: mediaUrl + data.Contents[0].Key,
        ETag: data.Contents[0].ETag,
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(media),
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

const handler = middy(s3GetMedia)
  .use(cors())
  .use(httpHeaderNormalizer())
  .use(httpJsonBodyParser())
  .use(httpErrorHandler());

export { handler };
