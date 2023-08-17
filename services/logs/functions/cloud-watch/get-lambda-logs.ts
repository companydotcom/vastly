import middy from "@middy/core";
import inputOutputLogger from "@middy/input-output-logger";

const getLambdaLogs = async (event) => {};

const handler = middy(getLambdaLogs).use(inputOutputLogger());

export { handler };
