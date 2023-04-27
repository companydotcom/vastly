import { Secret } from "../../types/index.js";
import { Client } from "../client.js";
import { executeDeleteSecret } from "./index.js";

export default async function doDeleteSecret(client: Client, secret: Secret) {
  const { output } = client;
  try {
    const data = await executeDeleteSecret(client, secret);
    return data;
  } catch (err: unknown) {
    output.error(err as string);
  }
}
