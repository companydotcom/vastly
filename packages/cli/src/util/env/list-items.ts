import { errorToString } from "@vastly/utils";
import { docClient, dynamoClient } from "./dynamo-client.js";
import { ScanCommand } from "@aws-sdk/client-dynamodb";

export default async function listTableItems(): Promise<any> {
  try {
    const command = new ScanCommand({ TableName: "env" });
    const response = await docClient.send(command);

    if (response.$metadata.httpStatusCode === 200) {
      const formattedData = response.Items?.map((item) => {
        const formattedItem: any = {};
        for (const key in item) {
          if (Object.prototype.hasOwnProperty.call(item, key)) {
            formattedItem[key] = item[key].S;
          }
        }
        return formattedItem;
      });
      console.table(formattedData, ["app", "keyName", "stage"]);
      return formattedData;
    }
    throw new Error();
  } catch (error) {
    throw new Error(`List Table Items: ${errorToString(error)}`);
  } finally {
    dynamoClient.destroy();
  }
}
