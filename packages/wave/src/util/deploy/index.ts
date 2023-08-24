import { errorToString } from "@vastly/utils";
import { Client } from "../client.js";
import { isAPIError } from "../error.js";

export interface DeployResult {}

export default async function doDeploy(client: Client, stage: string) {
  const { output } = client;
  let spinner = output.spinner;

  if (!stage) {
    throw Error();
  }

  try {
    const data = await executeDeploy(client, stage);
    console.log("🚀 ~ file: index.ts:17 ~ doDeploy ~ data:", data);
    // if data or whatever gets returned is valid, run the sst deploy command
    return data;
  } catch (err: unknown) {
    output.error(errorToString(err));
    return 0;
  }
}

async function executeDeploy(client: Client, stage: string): Promise<DeployResult> {
  const { apiUrl } = client;

  try {
    // hardcoded account_id to "sandbox-aft-1"
    return await client.fetch<DeployResult>(`${apiUrl}/deploy/480162884130`, {
      method: "POST",
    });
  } catch (err: unknown) {
    console.log("🚀 ~ file: index.ts:34 ~ executeDeploy ~ err:", err);
    // if (isAPIError(err)) {
    // if (err.code === "USER_NOT_FOUND") {
    //   throw new Error("User not found. Please sign up.");
    // }
    // }

    throw new Error(`Unexpected error: ${errorToString(err)}`);
  }
}
