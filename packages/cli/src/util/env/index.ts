import { errorToString } from "@vastly/utils";
import { EnvVariable, EnvResult } from "../../types/index.js";
import { Client } from "../client.js";

export async function executeAddVariable(client: Client, env: EnvVariable): Promise<EnvResult> {
  try {
    return await client.fetch<EnvResult>(
      `https://x5x5pwee0a.execute-api.us-east-1.amazonaws.com/dev/env/${env.environment}`,
      {
        method: "POST",
        body: env,
      },
    );
  } catch (err: unknown) {
    throw new Error(`Unexpected error: ${err}`);
  }
}

export async function executeDeleteVariable(
  client: Client,
  { environment, projects, keyName }: EnvVariable,
): Promise<EnvResult> {
  try {
    return await client.fetch<EnvResult>(
      `https://x5x5pwee0a.execute-api.us-east-1.amazonaws.com/dev/env/${environment}?p=${projects}`,
      {
        method: "DELETE",
        body: keyName,
      },
    );
  } catch (err: unknown) {
    throw new Error(`Unexpected error: ${errorToString(err)} Check keyName and Environment`);
  }
}

export async function executePullAllVariables(
  client: Client,
  {
    environment = "dev",
    projects,
    eventType,
  }: { environment?: string; projects?: string; eventType: string },
): Promise<EnvVariable[]> {
  try {
    return await client.fetch<EnvVariable[]>(
      `https://x5x5pwee0a.execute-api.us-east-1.amazonaws.com/dev/env/${environment}?event=${eventType}&p=${projects}`,
      {
        method: "GET",
      },
    );
  } catch (err: unknown) {
    throw new Error(`Unexpected error: ${err}`);
  }
}
