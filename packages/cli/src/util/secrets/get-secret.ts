import { Client } from "../client.js";
import { executeGetSecret } from "./index.js";

export default async function doGetSecret(client: Client, env: string) {
  const { output } = client;
  try {
    const data = await executeGetSecret(client, env);
    return data;
  } catch (err: unknown) {
    output.error(err as string);
  }
}
