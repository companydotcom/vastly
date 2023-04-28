import { Client } from "../client.js";
import { executePullAllVariables } from "./index.js";

export async function doPullEnv(
  client: Client,
  env: { environment?: string; projects?: string; eventType: string },
) {
  const { output } = client;
  try {
    const data = await executePullAllVariables(client, env);
    return data;
  } catch (err: unknown) {
    output.error(err as string);
  }
}
