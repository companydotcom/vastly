import { EnvVariable } from "../../types/index.js";
import { Client } from "../client.js";
import { executeAddVariable } from "./index.js";

export default async function doAddSecret(client: Client, envVar: EnvVariable) {
  const { output } = client;
  try {
    const data = await executeAddVariable(client, envVar);
    return data;
  } catch (err: unknown) {
    output.error(err as string);
  }
}
