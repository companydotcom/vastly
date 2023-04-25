import { Client } from "../client.js";
import { executeGetAllSecrets } from "./index.js";

export default async function doGetAllSecrets(
  client: Client,
  secrets: { environment: string; directory: string[] },
) {
  const { output } = client;
  try {
    const data = await executeGetAllSecrets(client, secrets);
    return data;
  } catch (err: unknown) {
    output.error(err as string);
  }
}
