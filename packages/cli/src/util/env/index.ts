import { EnvVariable, EnvResult } from "../../types/index.js";
import { Client } from "../client.js";

export async function executeAddVariable(client: Client, env: EnvVariable): Promise<EnvResult> {
  try {
    return await client.fetch<EnvResult>(
      `https://96dcyft9wj.execute-api.us-east-1.amazonaws.com/${env.environment}/env`,
      {
        method: "POST",
        body: env,
      },
    );
  } catch (err: unknown) {
    throw new Error(`Unexpected error: ${err}`);
  }
}

export async function executeDeleteVariable(client: Client, env: EnvVariable): Promise<EnvResult> {
  try {
    return await client.fetch<EnvResult>(
      `https://96dcyft9wj.execute-api.us-east-1.amazonaws.com/${env.environment}/env`,
      {
        method: "DELETE",
        body: env.key,
      },
    );
  } catch (err: unknown) {
    throw new Error(`Unexpected error: ${err}`);
  }
}

export async function executePullAllVariables(
  client: Client,
  { environment, directory }: { environment: string; directory: string[] },
): Promise<EnvVariable[]> {
  try {
    return await client.fetch<EnvVariable[]>(
      `https://96dcyft9wj.execute-api.us-east-1.amazonaws.com/${environment}/env`,
      {
        method: "GET",
      },
    );
  } catch (err: unknown) {
    throw new Error(`Unexpected error: ${err}`);
  }
}
