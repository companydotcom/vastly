import dns from "node:dns";
import { errorToString } from "@vastly/utils";
import { Client } from "../client.js";
import { isAPIError } from "../error.js";

export interface DeployResult {
  AccessKeyId: string;
  SecretAccessKey: string;
  SessionToken: string;
  Expiration: string | Date;
}

export default async function doDeploy(client: Client, stage: string) {
  const { output } = client;
  if (!stage) {
    throw Error();
  }
  try {
    const res = await executeDeploy(client, stage);
    return res;
  } catch (err: unknown) {
    output.error(errorToString(err));
    return;
  }
}

async function executeDeploy(client: Client, stage: string): Promise<DeployResult> {
  const { apiUrl } = client;
  dns.setDefaultResultOrder("ipv4first");

  try {
    // hardcoded account_id (stage) to infra-prod
    const res: DeployResult = await client.fetch(`${apiUrl}/deploy/908170539157`, {
      method: "POST",
    });
    return res;
  } catch (err: unknown) {
    if (isAPIError(err)) {
      if (err.code === "USER_NOT_FOUND") {
        throw new Error("User not found. Please sign up.");
      }
    }

    throw new Error(`Unexpected error: ${errorToString(err)}`);
  }
}
