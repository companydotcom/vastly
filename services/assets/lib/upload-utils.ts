import { createHash } from "crypto";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { File, S3UploadResponse } from "../types";
import xdgAppPaths from "xdg-app-paths";
import { join } from "path";
import { loadJsonFileSync } from "load-json-file";
import { Config } from '@vastly/types';


export const multipleFileUpload = async (
  files: File[],
  filePath: string,
  bucketName: string,
  credentials?: any,
): Promise<S3UploadResponse> => {
  try {
    if (!files || !filePath || !bucketName) {
      throw Error("Missing event body or bucket name!");
    }

    // const { credentials } = await roleChaining();
    const s3Client = new S3Client([
      {
        region: "us-east-1",
        credentials: {
          accessKeyId: credentials?.AccessKeyId,
          secretAccessKey: credentials?.SecretAccessKey,
          sessionToken: credentials?.SessionToken,
          expiration: credentials?.Expiration,
        },
      },
    ]);
    const inputs = files.map((f: File) => {
      const Key = `${filePath}/${f?.filename}`;
      return {
        Body: f?.content,
        Key,
        ContentType: f.mimetype,
        ContentMD5: createHash("md5").update(f.content).digest("base64"),
        Bucket: bucketName,
        RequestPayer: "requester",
        Tagging: `type=${f.mimetype?.split("/")[0]}&format=${f.mimetype?.split("/")[1]}`,
        ACL: "public-read",
      };
    });

    const results = await Promise.all(
      inputs.map(async (object) => {
        const command = new PutObjectCommand(object);
        const result = s3Client.send(command);
        return result;
      }),
    );
    return {
      isBase64Encoded: false,
      statusCode: 200,
      body: JSON.stringify({
        results,
      }),
    };
  } catch (err) {
    console.error(err);
    return {
      isBase64Encoded: false,
      statusCode: err.$metadata.httpStatusCode,
      body: JSON.stringify({
        message: err.message || "Failed to upload images",
      }),
    };
  }
};

export const getGlobalPathConfig = (): string => {
  const configDirs = (xdgAppPaths)({
    name: "vastly",
  }).dataDirs();

  return configDirs[0];
};

export const readConfigFile = () => {
  const VASTLY_DIR = getGlobalPathConfig();
  const CONFIG_FILE_PATH = join(VASTLY_DIR, "config.json");
  const config = loadJsonFileSync(CONFIG_FILE_PATH);
  return config as Config;
};
