import httpErrorHandler from "@middy/http-error-handler";
import cors from "@middy/http-cors";
import jsonBodyParser from "@middy/http-json-body-parser";
import middy from "@middy/core";
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import type { NativeAttributeValue } from "@aws-sdk/util-dynamodb";
import type { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import type { DynamoDBDocument, QueryCommandInput, ScanCommandInput } from "@aws-sdk/lib-dynamodb";
import { dynamoClient, docClient } from "../../lib/dynamodb";
import { errorToString } from "@vastly/utils";

const { TABLE_NAME } = process.env;

const baseHandler = async ({
  pathParameters,
  queryStringParameters,
}: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const env = pathParameters?.env?.toLowerCase();
  const eventType = queryStringParameters?.["event"];
  const project = queryStringParameters?.["p"] || "";

  if (!env) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: "Missing env parameter",
      }),
    };
  }

  try {
    let response;
    switch (eventType) {
      case "pull-projects":
        response = await getAllProjects(docClient, dynamoClient);
        break;
      case "pull-env":
        response = await getAllEnv({ env, project }, docClient, dynamoClient);
        break;
      case "pull-keys":
        response = await getKeyNames({ env, project }, docClient, dynamoClient);
        break;
      case "":
        throw new Error("Please provide an EventType");
      default:
        break;
    }

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    return {
      statusCode: 501,
      body: JSON.stringify(error),
    };
  }
};

async function getAllEnv(
  { env, project }: { env: string; project: string },
  dynamoDoc: DynamoDBDocument,
  dynamo: DynamoDBClient,
): Promise<Record<string, NativeAttributeValue>[] | undefined> {
  console.log(`Fetching variables for ${env}...`);

  const input: QueryCommandInput = {
    TableName: TABLE_NAME || "env",
    KeyConditionExpression: "projects = :project and begins_with(environment_keyName, :env)",
    ExpressionAttributeValues: {
      ":project": project,
      ":env": `${env}:`,
    },
    ProjectionExpression: "environment_keyName, keyValue",
  };

  try {
    const { Items } = await dynamoDoc.query(input);
    return Items;
  } catch (error) {
    console.log(error);
    throw new Error(`${errorToString(error)}`);
  } finally {
    dynamo.destroy();
  }
}

async function getAllProjects(
  dynamoDoc: DynamoDBDocument,
  dynamo: DynamoDBClient,
): Promise<string[] | []> {
  console.log(`Fetching projects...`);
  const input: ScanCommandInput = {
    TableName: TABLE_NAME || "env",
    ProjectionExpression: "projects",
    Select: "SPECIFIC_ATTRIBUTES",
  };

  try {
    const { Items } = await dynamoDoc.scan(input);
    if (!Items?.length) {
      return [];
    }

    // Returns only unique values
    const projects = new Set<string>();
    Items?.forEach((item: Record<string, string>) => {
      projects.add(item["projects"]);
    });
    console.log([...projects]);
    return [...projects];
  } catch (error) {
    console.log(error);
    throw new Error(`${errorToString(error)}: Projects`);
  } finally {
    dynamo.destroy();
  }
}

async function getKeyNames(
  { env, project }: { env: string; project: string },
  dynamoDoc: DynamoDBDocument,
  dynamo: DynamoDBClient,
): Promise<string[] | []> {
  const params = {
    TableName: TABLE_NAME || "env",
    KeyConditionExpression: "projects = :project and begins_with(environment_keyName, :env)",
    ExpressionAttributeValues: {
      ":project": project,
      ":env": `${env}:`,
    },
    ProjectionExpression: "environment_keyName",
  };

  try {
    const { Items } = await dynamoDoc.query(params);
    const keyNames = Items?.map((item) => item.environment_keyName.split(":")[1]);
    return keyNames ?? [];
  } catch (error) {
    console.log(error);
    throw new Error(`${errorToString(error)}: Key names`);
  } finally {
    dynamo.destroy();
  }
}

const getAllEnvHandler = middy(baseHandler)
  .use(jsonBodyParser())
  .use(cors())
  .use(httpErrorHandler());

export { getAllEnvHandler, baseHandler, getAllEnv, getAllProjects, getKeyNames };
