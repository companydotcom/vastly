import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createWriteStream } from "fs";
import { fileURLToPath } from "node:url";
import { Range } from "../types";

export const getObjectRange = async ({
  bucket,
  key,
  start,
  end,
  s3Client,
}: {
  bucket: string;
  key: string;
  start: number;
  end: number;
  s3Client: S3Client;
}): Promise<any> => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
    Range: `bytes=${start}-${end}`,
  });

  return await s3Client.send(command);
};

export const getRangeAndLength = (contentRange: string): Range => {
  const [range, length] = contentRange.split("/");
  const [start, end] = range.split("-");
  return {
    start: parseInt(start),
    end: parseInt(end),
    length: parseInt(length),
  };
};

export const isComplete = ({ end, length }: Range): boolean => end === length - 1;

export const downloadInChunks = async ({
  bucket,
  key,
  s3Client,
}: {
  bucket: string;
  key: string;
  s3Client: S3Client;
}): Promise<void> => {
  const oneMB = 1024 * 1024;
  // writes stream to local file
  const writeStream = createWriteStream(fileURLToPath(new URL(`./${key}`, import.meta.url))).on(
    "error",
    (err) => {
      throw Error("Error in writeStream");
    },
  );

  let rangeAndLength = { start: -1, end: -1, length: -1 };

  while (!isComplete(rangeAndLength)) {
    const { end } = rangeAndLength;
    const nextRange = { start: end + 1, end: end + oneMB };

    console.log(`Downloading bytes ${nextRange.start} to ${nextRange.end}`);

    const { ContentRange, Body } = await getObjectRange({
      bucket,
      key,
      s3Client,
      ...nextRange,
    });

    writeStream.write(await Body.transformToByteArray());
    rangeAndLength = getRangeAndLength(ContentRange);
  }
};
