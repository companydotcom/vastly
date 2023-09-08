import {
  CreateBucketCommand,
  S3Client,
  ListBucketsCommand,
  PutBucketVersioningCommand,
  PutBucketPolicyCommand,
  PutPublicAccessBlockCommand,
} from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";
import { assumeRole } from "@vastly/utils";
import type { Bucket } from "@aws-sdk/client-s3";

interface ListOrCreateMediaBucketResponse {
  bucketName?: string;
  creationDate?: string | Date;
  location?: string;
}

export const listOrCreateMediaBucket = async (
  client: S3Client,
  waveProjectName: string,
  credentials?: any,
): Promise<ListOrCreateMediaBucketResponse> => {
  if (!client || !waveProjectName) {
    throw Error("Missing user or S3 client");
  }

  // checks for existing assets bucket
  try {
    let assetsBucket;

    const listCommand = new ListBucketsCommand({});
    const { Buckets } = await client.send(listCommand);
    if (Buckets?.length) {
      assetsBucket = Buckets.find((b: Bucket) => b.Name?.includes(`${waveProjectName}-assets-5`));
    }
    if (assetsBucket?.Name) {
      return {
        bucketName: assetsBucket?.Name,
        creationDate: assetsBucket?.CreationDate,
      };
    }
  } catch (err) {
    console.error(err);
    throw Error(`${err}: Error fetching buckets`);
  }

  // creates new bucket if one does not exist
  try {
    const newS3Client = new S3Client({
      region: "us-east-1",
      credentials: {
        accessKeyId: credentials?.AccessKeyId,
        secretAccessKey: credentials?.SecretAccessKey,
        sessionToken: credentials?.SessionToken,
        expiration: credentials?.Expiration,
      },
    });
    const bucketName = `${waveProjectName}-assets-${uuid()}`;
    const input = {
      Bucket: bucketName,
      // ObjectOwnership: "BucketOwnerPreferred",
    };

    const createCommand = new CreateBucketCommand(input);
    const response = await newS3Client.send(createCommand);
    if (response?.Location) {
      console.log("----- Create Bucket Response -----", response);
      await addBucketPolicy(bucketName, credentials);
      await addBucketVersioning(bucketName, credentials);
      return {
        bucketName,
        location: response.Location,
      };
    }
    throw Error();
  } catch (err) {
    console.error(err);
    throw Error(`${err}: Error creating bucket`);
  }
};

export const addBucketVersioning = async (bucketName: string, credentials?: any) => {
  const newS3Client = new S3Client({
    region: "us-east-1",
    credentials: {
      accessKeyId: credentials?.AccessKeyId,
      secretAccessKey: credentials?.SecretAccessKey,
      sessionToken: credentials?.SessionToken,
      expiration: credentials?.Expiration,
    },
  });
  try {
    const input = {
      Bucket: bucketName,
      VersioningConfiguration: {
        Status: "Enabled",
      },
    };
    const command = new PutBucketVersioningCommand(input);
    return await newS3Client.send(command);
  } catch (err) {
    console.error(err);
    throw Error(`${err}: Error enabling bucket versioning`);
  }
};

export const addBucketPolicy = async (bucketName: string, credentials?: any) => {
  const newS3Client = new S3Client({
    region: "us-east-1",
    credentials: {
      accessKeyId: credentials?.AccessKeyId,
      secretAccessKey: credentials?.SecretAccessKey,
      sessionToken: credentials?.SessionToken,
      expiration: credentials?.Expiration,
    },
  });
  try {
    const input = {
      Bucket: bucketName,
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: false,
        IgnorePublicAcls: false,
        BlockPublicPolicy: false,
        RestrictPublicBuckets: false,
      },
    };
    const command = new PutPublicAccessBlockCommand(input);
    await newS3Client.send(command);
  } catch (err) {
    console.error(err);
    throw Error(`${err}: Error attaching bucket policy`);
  }

  try {
    // Allows THM and infra-prod bucket access hard-coded for now
    const policy = {
      Version: "2012-10-17",
      Statement: [
        {
          Sid: "AllowsS3Access",
          Principal: {
            AWS: [
              "arn:aws:iam::908170539157:role/AssetServiceRole",
              "arn:aws:iam::229258319284:role/CrossAccountAssetServiceRole",
              "908170539157",
              "229258319284",
            ],
          },
          Effect: "Allow",
          Action: ["s3:*"],
          Resource: `arn:aws:s3:::${bucketName}/*`,
        },
      ],
    };

    const input = {
      Bucket: bucketName,
      Policy: JSON.stringify(policy),
    };
    const command = new PutBucketPolicyCommand(input);
    return await newS3Client.send(command);
  } catch (err) {
    console.error(err);
    throw Error(`${err}: Error attaching bucket policy`);
  }
};

export const roleChaining = async () => {
  const roleChainCreds = await assumeRole("AssetServiceRole", "908170539157");
  const response = await assumeRole(
    "CrossAccountAssetServiceRole",
    "229258319284",
    roleChainCreds?.Credentials,
  );
  return { credentials: response.Credentials, role: response.AssumedRoleUser };
};
