import { PreTokenGenerationTriggerHandler } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument, GetCommand } from "@aws-sdk/lib-dynamodb";

const dynamoClient = new DynamoDBClient({ region: "us-east-1" });
export const docClient = DynamoDBDocument.from(dynamoClient);

const handler: PreTokenGenerationTriggerHandler = async (event) => {
  console.log("PreTokenGenerationTriggerHandler= : event", event);

  const organization = event.request.userAttributes["custom:organization"];

  const command = new GetCommand({
    TableName: "User",
    Key: {
      user_id: event.userName,
      organization,
    },
  });

  try {
    // @ts-ignore issue with the aws-sdk libraries
    // https://github.com/aws/aws-sdk-js-v3/issues/3390
    const { Item } = await docClient.send(command);

    const accounts = JSON.stringify(Item?.accounts);

    // Modify the response object to add accounts for the user. This should now appear on their cognito id token
    event.response.claimsOverrideDetails = {
      claimsToAddOrOverride: {
        accounts,
      },
    };

    return event;
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        status: "ERROR_GENERATING_TOKEN",
        message: error.message,
      }),
    };
  } finally {
    dynamoClient.destroy();
  }
};

export { handler };
