export interface ListOrCreateMediaBucketResponse {
  bucketName?: string;
  creationDate?: string | Date;
  location?: string;
}

export interface File {
  filename: string;
  mimetype: string;
  encoded: string;
  truncated: string;
  content: Buffer;
}

export interface Credentials {
  AccessKeyId?: string;
  SecretAccessKey?: string;
  SessionToken?: string;
  Expiration?: string | Date;
}

export interface RoleChainingResponse {
  credentials?: Credentials;
  role?: {
    AssumedRoleId?: string;
    Arn?: string;
  };
}

export interface S3UploadResponse {
  isBase64Encoded: boolean;
  statusCode: number;
  body: string;
}

export interface Range {
  start: number;
  end: number;
  length: number;
}
