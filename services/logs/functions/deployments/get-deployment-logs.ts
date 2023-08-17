import middy from "@middy/core";
import inputOutputLogger from "@middy/input-output-logger";

const getDeploymentLogs = async (event) => {};

const handler = middy(getDeploymentLogs).use(inputOutputLogger());

export { handler };
