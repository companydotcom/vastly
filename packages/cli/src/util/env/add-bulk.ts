import fs from "fs";
import readline from "node:readline";
import type { PutCommandInput } from "@aws-sdk/lib-dynamodb";
import { errorToString } from "@vastly/utils";
import { docClient, dynamoClient } from "./dynamo-client.js";

export default async function addVariableBulk(
  answers: {
    app: string;
    bulkOrSingle: string;
    filePath: string;
  },
  stage: string,
): Promise<any> {
  const { TABLE_NAME } = process.env;

  try {
    const fileStream = fs.createReadStream(answers.filePath);

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    const writes = [];

    for await (const line of rl) {
      // Each line in input.txt will be successively available here as `line`.
      const splitLine = line.split("=");

      const params: PutCommandInput = {
        TableName: TABLE_NAME || "env",
        Item: {
          app: answers?.app,
          "keyName#stage": `${splitLine[0]}#${stage}`,
          keyName: splitLine[0],
          keyValue: splitLine?.slice(1, splitLine?.length)?.join("="),
          stage,
        },
      };

      const result = docClient.put(params);
      writes.push(docClient.put(params));
    }

    const responses = await Promise.all(writes);
    return responses;
  } catch (error) {
    console.log(error);
    throw new Error(`${errorToString(error)}`);
  } finally {
    dynamoClient.destroy();
  }
}
