import { errorToString } from "@vastly/utils";
import { EnvVariable } from "../../types/index.js";
import { Client } from "../client.js";
import { executeDeleteVariable } from "./index.js";

export default async function doDeleteEnv(client: Client, env: EnvVariable) {
  const { output } = client;
  try {
    const data = await executeDeleteVariable(client, env);
    return data;
  } catch (err: unknown) {
    throw Error(errorToString(err));
  }
}
