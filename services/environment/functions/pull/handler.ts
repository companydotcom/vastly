import httpErrorHandler from "@middy/http-error-handler";
import cors from "@middy/http-cors";
import jsonBodyParser from "@middy/http-json-body-parser";
import middy from "@middy/core";
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import type { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import type { DynamoDBDocument, QueryCommandInput, ScanCommandInput } from "@aws-sdk/lib-dynamodb";
import { dynamoClient, docClient } from "../../lib/dynamodb";

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
      body: "You must provide a valid environment name.",
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
      statusCode: error.statusCode || 501,
      body: JSON.stringify(error),
    };
  }
};

async function getAllEnv(
  { env, project }: { env: string; project: string },
  dynamoDoc: DynamoDBDocument,
  dynamo: DynamoDBClient,
) {
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
    console.log("Error fetching variables: ", error);
  } finally {
    dynamo.destroy();
  }
}

async function getAllProjects(dynamoDoc: DynamoDBDocument, dynamo: DynamoDBClient) {
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
    console.log("Error fetching variables: ", error);
  } finally {
    dynamo.destroy();
  }
}

async function getKeyNames(
  { env, project }: { env: string; project: string },
  dynamoDoc: DynamoDBDocument,
  dynamo: DynamoDBClient,
) {
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
    const keyNames = Items?.map((item) => item.environment_keyName.S.split(":")[1]);
    return keyNames;
  } catch (err) {
    console.error(err);
  } finally {
    dynamo.destroy();
  }
}

const getAllEnvHandler = middy(baseHandler)
  .use(jsonBodyParser())
  .use(cors())
  .use(httpErrorHandler());

export { getAllEnvHandler };
