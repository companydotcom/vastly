import httpErrorHandler from "@middy/http-error-handler";
import cors from "@middy/http-cors";
import jsonBodyParser from "@middy/http-json-body-parser";
import middy from "@middy/core";
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { QueryCommandInput, ScanCommand, ScanCommandInput } from "@aws-sdk/lib-dynamodb";
import { pull, dynamoClient, dynamoDocClient, scan } from "../../lib/dynamodb";

const db = dynamoDocClient;
const { TABLE_NAME } = process.env;

const baseHandler: APIGatewayProxyHandlerV2 = async ({ pathParameters, queryStringParameters }) => {
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
        response = await getAllProjects();
        break;
      case "pull-env":
        response = await getAllEnv(env, project);
        break;
      case "pull-keys":
        response = await getKeyNames(env, project);
        break;
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

async function getAllEnv(env: string, proj: string) {
  console.log(`Fetching variables for ${env}...`);

  // Psycho AWS login: if projects = 'input project' AND env_keyName starts with 'input env'
  const input: QueryCommandInput = {
    TableName: TABLE_NAME || "env",
    KeyConditionExpression: "projects = :project and begins_with(environment_keyName, :env)",
    ExpressionAttributeValues: {
      ":project": proj,
      ":env": `${env}:`,
    },
    ProjectionExpression: "environment_keyName, keyValue",
  };

  const queryCommand = new pull(input);

  try {
    const { Items } = await db.send(queryCommand);
    return Items;
  } catch (error) {
    console.log("Error fetching variables: ", error);
  } finally {
    dynamoClient.destroy();
  }
}

async function getAllProjects() {
  console.log(`Fetching projects...`);
  const input: ScanCommandInput = {
    TableName: TABLE_NAME || "env",
    ProjectionExpression: "projects",
    Select: "SPECIFIC_ATTRIBUTES",
  };
  const scanCommand: ScanCommand = new scan(input);

  try {
    const { Items } = await db.send(scanCommand);
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
    dynamoClient.destroy();
  }
}

async function getKeyNames(env: string, proj: string) {
  const params = {
    TableName: "your-table-name",
    KeyConditionExpression: "projects = :project and begins_with(environment_keyName, :env)",
    ExpressionAttributeValues: {
      ":project": proj,
      ":env": `${env}:`,
    },
    ProjectionExpression: "environment_keyName",
  };

  const command = new pull(params);

  try {
    const { Items } = await db.send(command);
    const keyNames = Items?.map((item) => item.environment_keyName.S.split(":")[1]);
    return keyNames;
  } catch (err) {
    console.error(err);
  }
}

const getAllEnvHandler = middy(baseHandler)
  .use(jsonBodyParser())
  .use(cors())
  .use(httpErrorHandler());

export { getAllEnvHandler };
