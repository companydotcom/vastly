import { errorToString } from "@vastly/utils";
import { docClient, dynamoClient } from "./dynamo-client.js";
import {
  CreateTableCommand,
  CreateTableCommandOutput,
  CreateTableInput,
  ListTablesCommand,
  ListTablesCommandOutput,
} from "@aws-sdk/client-dynamodb";

export async function findOrCreateTable(): Promise<any> {
  try {
    const command = new ListTablesCommand({});
    const response: ListTablesCommandOutput = await docClient.send(command);
    if (response.TableNames?.includes("env")) {
      return true;
    }

    const table: CreateTableCommandOutput = await createTable();
    if (table.$metadata.httpStatusCode === 200) {
      return true;
    }
  } catch (error: unknown) {
    console.error(`Error in findOrCreateTable: ${errorToString(error)}`);
    return false;
  } finally {
    dynamoClient.destroy();
  }
}

async function createTable() {
  try {
    const input: CreateTableInput = {
      AttributeDefinitions: [
        {
          AttributeName: "app",
          AttributeType: "S",
        },
        {
          AttributeName: "keyName#stage",
          AttributeType: "S",
        },
      ],
      TableName: "env",
      BillingMode: "PROVISIONED",
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
      KeySchema: [
        {
          AttributeName: "app",
          KeyType: "HASH",
        },
        {
          AttributeName: "keyName#stage",
          KeyType: "RANGE",
        },
      ],
    };

    const command = new CreateTableCommand(input);
    const response = await docClient.send(command);
    return response;
  } catch (error: unknown) {
    throw new Error(`Create Table: ${errorToString(error)}`);
  }
}