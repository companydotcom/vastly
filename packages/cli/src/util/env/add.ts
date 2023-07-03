import { errorToString } from "@vastly/utils";
import { EnvVariable } from "../../types/index.js";
import { Client } from "../client.js";
import { executeAddVariable } from "./index.js";

export default async function doAddEnv(client: Client, envVar: EnvVariable) {
  try {
    const data = await executeAddVariable(client, envVar);
    return data;
  } catch (err: unknown) {
    throw Error(errorToString(err));
  }
}
