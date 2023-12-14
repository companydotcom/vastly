import middy from "@middy/core";
import cors from "@middy/http-cors";
import { createHash } from "node:crypto";
import httpErrorHandler from "@middy/http-error-handler";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import httpMultipartBodyParser from "@middy/http-multipart-body-parser";
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { multipleFileUpload, normalizeFilePath, getMediaBucket, readConfigFile } from "../../lib";
import { UseAssumeRole } from '@vastly/utils';


const { AWS_REGION } = process.env;

const s3uploadMedia = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const file = event.body?.["file"];
    const clientName = event.pathParameters?.clientName;
    const filePath = normalizeFilePath(event.body?.["filePath"]);
    const idToken = event.headers?.["authorization"] || readConfigFile().token?.idToken;


    if (!file || !clientName || !filePath) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          location: "Incorrect body on request",
        }),
      };
    }

    const assumeRoleResult = await UseAssumeRole(idToken, clientName, "CrossAccountAssetServiceRole");
    if ("error" in assumeRoleResult) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          location: `${assumeRoleResult.error}`,
        }),
      };
    }

    const s3Client = new S3Client([
      {
        region: AWS_REGION,
        credentials: {
          accessKeyId: assumeRoleResult.Credentials?.AccessKeyId,
          secretAccessKey: assumeRoleResult.Credentials?.SecretAccessKey,
          sessionToken: assumeRoleResult.Credentials?.SessionToken,
          expiration: assumeRoleResult.Credentials?.Expiration,
        },
      },
    ]);
    const { bucketName, client } = await getMediaBucket(s3Client, clientName, assumeRoleResult.Credentials);

    if (file.length > 1) {
      return await multipleFileUpload(file, filePath, bucketName ?? "", assumeRoleResult.Credentials);
    }
    const detectedMime = file?.mimetype || "unspecifiedMimeType";

    const Key = `${filePath}/${file?.filename}`;
    const input = {
      Body: file?.content,
      Key,
      ContentType: detectedMime,
      ContentMD5: createHash("md5").update(file.content).digest("base64"),
      Bucket: bucketName,
      RequestPayer: "requester",
      Tagging: `type=${detectedMime?.split("/")[0]}&format=${detectedMime?.split("/")[1]}`,
    };

    console.log(`Writing image to bucket: ${Key}`);
    console.log("------- File Contents --------\n", input);
    const command = new PutObjectCommand(input);
    const response = await client?.send(command);
    const url = `https://${bucketName}.s3.amazonaws.com/${Key}`;

    return {
      isBase64Encoded: false,
      statusCode: 200,
      body: JSON.stringify({
        location: url,
        ...response,
      }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        location: err.message || "Failed to upload image",
      }),
    };
  }
};

const handler = middy(s3uploadMedia)
  .use(cors())
  .use(httpErrorHandler())
  .use(httpHeaderNormalizer())
  .use(httpMultipartBodyParser({ disableContentTypeError: true }));

export { handler };
