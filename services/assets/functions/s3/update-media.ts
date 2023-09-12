import middy from "@middy/core";
import cors from "@middy/http-cors";
import httpErrorHandler from "@middy/http-error-handler";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import { S3Client, PutBucketLifecycleConfigurationCommand } from "@aws-sdk/client-s3";
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getMediaBucket, normalizeFilePath, roleChaining } from "../../lib";

const { AWS_REGION } = process.env;

const s3UpdateAllMediaPerPath = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const clientName = event.pathParameters?.clientName;
    const fileName = normalizeFilePath(event.body?.["fileName"]);
    const filePath = normalizeFilePath(event.body?.["filePath"]);

    if (!clientName) {
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

    // Moves either entire path or specific object to storage class
    const newRule = [
      {
        ID: `archive:${filePath}/${fileName ?? ""}`,
        Filter: {
          Prefix: `${filePath}/${fileName ?? ""}`,
        },
        Status: "Enabled",
        Transitions: [
          {
            Days: 30,
            StorageClass: "STANDARD_IA",
          },
        ],
        NoncurrentVersionTransitions: [
          {
            NoncurrentDays: 30,
            StorageClass: "STANDARD_IA",
          },
        ],
      },
    ];

    const lifecycleParams = {
      Bucket: bucketName,
      LifecycleConfiguration: {
        Rules: newRule,
      },
    };

    const appendLifecycle = new PutBucketLifecycleConfigurationCommand(lifecycleParams);
    const data = await s3Client.send(appendLifecycle);

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error(err.message);
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: err.message || "Failed to update lifecycle",
      }),
    };
  }
};

const handler = middy(s3UpdateAllMediaPerPath)
  .use(cors())
  .use(httpHeaderNormalizer())
  .use(httpJsonBodyParser())
  .use(httpErrorHandler());

export { handler };
