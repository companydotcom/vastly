import { Client } from "../client.js";
import { executePullAllVariables } from "./index.js";

export default async function doPullAllEnv(
  client: Client,
  env: { environment: string; directory: string[] },
) {
  const { output } = client;
  try {
    const data = await executePullAllVariables(client, env);
    return data;
  } catch (err: unknown) {
    output.error(err as string);
  }
}
