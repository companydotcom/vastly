import middy from "@middy/core";
import cors from "@middy/http-cors";
import { createHash } from "node:crypto";
import httpErrorHandler from "@middy/http-error-handler";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import httpMultipartBodyParser from "@middy/http-multipart-body-parser";
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { listOrCreateMediaBucket, roleChaining } from "../../lib/utils";

const { AWS_REGION } = process.env;

const s3upload = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const projectName = event.pathParameters?.waveProjectName;
    const file = event.body?.["file"];

    if (!file || !file.content || !file.mimetype || !projectName) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Incorrect body on request",
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
    const { bucketName } = await listOrCreateMediaBucket(s3Client, projectName, credentials);

    const detectedMime = file?.mimetype || "unspecifiedMimeType";

    // create unique object names
    const Key = `${detectedMime}/${new Date().toLocaleDateString("en-CA")}/${file.filename}`;
    const input = {
      Body: file.content,
      Key,
      ContentType: detectedMime,
      ContentMD5: createHash("md5").update(file.content).digest("base64"),
      Bucket: bucketName,
      RequestPayer: "requester",
      // ACL: "bucket-owner-full-control",
    };

    console.log(`Writing image to bucket: ${Key}`);
    console.log("------- File Contents --------\n", input);

    const newS3Client = new S3Client([
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
    const command = new PutObjectCommand(input);
    const response = await newS3Client.send(command);
    const url = `https://${bucketName}.s3-${AWS_REGION}.amazonaws.com/${Key}`;

    return {
      isBase64Encoded: false,
      statusCode: 200,
      body: JSON.stringify({
        fileUrl: url,
        ...response,
      }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: err.message || "Failed to upload image",
      }),
    };
  }
};

const handler = middy(s3upload)
  .use(cors())
  .use(httpErrorHandler())
  .use(httpHeaderNormalizer())
  .use(httpMultipartBodyParser({ disableContentTypeError: true }));

export { handler };
