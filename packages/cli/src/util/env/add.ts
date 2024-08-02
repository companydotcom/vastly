import { errorToString } from "@vastly/utils";
import type { PutCommandInput, PutCommandOutput } from "@aws-sdk/lib-dynamodb";
import { EnvVariable } from "../../types/index.js";
import { docClient, dynamoClient } from "./dynamo-client.js";

export default async function addVariable(
  newVariable: EnvVariable,
  stage: string,
): Promise<PutCommandOutput> {
  const { TABLE_NAME } = process.env;
  const params: PutCommandInput = {
    TableName: TABLE_NAME || "env",
    Item: {
      app: newVariable.app,
      "keyName#stage": `${newVariable.keyName}#${stage}`,
      keyName: newVariable.keyName,
      keyValue: newVariable.keyValue,
      stage,
    },
  };

  try {
    const response = await docClient.put(params);
    return response;
  } catch (error) {
    console.log(error);
    throw new Error(`${errorToString(error)}`);
  } finally {
    dynamoClient.destroy();
  }
}
