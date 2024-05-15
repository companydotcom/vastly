import { errorToString } from "@vastly/utils";
import { EnvVariable } from "../../types/index.js";
import { docClient, dynamoClient } from "./dynamo-client.js";
import { DeleteCommandInput, DeleteCommandOutput } from "@aws-sdk/lib-dynamodb";

export default async function deleteVariable({
  app,
  keyName,
}: EnvVariable): Promise<DeleteCommandOutput> {
  const params: DeleteCommandInput = {
    TableName: "env",
    Key: {
      app: app,
      keyName: keyName,
    },
    ConditionExpression: `attribute_exists(keyName)`,
  };

  try {
    const response = await docClient.delete(params);
    return response;
  } catch (error) {
    throw new Error(`Check keyName and app: ${errorToString(error)}`);
  } finally {
    dynamoClient.destroy();
  }
}