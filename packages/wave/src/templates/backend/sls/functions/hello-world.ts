import type { APIGatewayRequestAuthorizerEvent } from "aws-lambda";
import middy from "@middy/core";
import inputOutputLogger from "@middy/input-output-logger";

const helloWorld = async (event: APIGatewayRequestAuthorizerEvent) => {
  // custom implementations go here
};

const handler = middy(helloWorld).use(inputOutputLogger());

export { handler };
