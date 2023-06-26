import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import cors from "@middy/http-cors";
import inputOutputLogger from "@middy/input-output-logger";

const getUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log("🫵 event", event);

  return {
    statusCode: 200,
    body: JSON.stringify({}),
  };
};

const handler = middy(getUser).use(cors()).use(inputOutputLogger()).use(httpErrorHandler());

export { handler };
