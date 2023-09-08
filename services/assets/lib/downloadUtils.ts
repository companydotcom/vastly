import { GetObjectCommand } from "@aws-sdk/client-s3";
import { createWriteStream } from "fs";
import { fileURLToPath } from "node:url";

export const getObjectRange = ({ bucket, key, start, end, s3Client }) => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
    Range: `bytes=${start}-${end}`,
  });

  return s3Client.send(command);
};

export const getRangeAndLength = (contentRange) => {
  const [range, length] = contentRange.split("/");
  const [start, end] = range.split("-");
  return {
    start: parseInt(start),
    end: parseInt(end),
    length: parseInt(length),
  };
};

export const isComplete = ({ end, length }) => end === length - 1;

export const downloadInChunks = async ({ bucket, key, s3Client }) => {
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
