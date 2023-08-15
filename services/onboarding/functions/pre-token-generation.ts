import { PreTokenGenerationTriggerHandler } from "aws-lambda";
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";

const handler: PreTokenGenerationTriggerHandler = async (event) => {
  console.log("PreTokenGenerationTriggerHandler= : event", event);

  // const params = {
  //     TableName: "your-table-name",
  //     KeyConditionExpression: "#organizationKey = :organizationValue and #accountId = :accountValue",
  //     ExpressionAttributeNames: {
  //       "#organizationKey": "organizationKey",
  //       "#accountId": "accountId"
  //     },
  //     ExpressionAttributeValues: {
  //       ":organizationValue": { S: organizationKey },
  //       ":accountValue": { S: accountId }
  //     }
  //   };
  try {
    // TODO: Implement your custom logic here

    // Modify the response object if necessary
    // For example, to add custom claims to the ID token:

    event.response.claimsOverrideDetails = {
      claimsToAddOrOverride: {
        custom_claim_key: "custom_claim_value",
        // Add more custom claims as needed
      },
    };

    return event;
  } catch (error) {
    // Handle errors gracefully
    console.error("Error handling pre-token generation:", error);
    throw error;
  }
};

export { handler };
