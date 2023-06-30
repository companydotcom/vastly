import { errorToString } from "@vastly/utils";
import { Client } from "../client.js";
import { executePullAllVariables } from "./index.js";

export async function doPullEnv(
  client: Client,
  env: { environment?: string; projects?: string; eventType: string },
) {
  try {
    const data = await executePullAllVariables(client, env);
    return data;
  } catch (err: unknown) {
    throw Error(errorToString(err));
  }
}
