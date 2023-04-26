import { Secret } from "../../types/index.js";
import { Client } from "../client.js";
import { executeAddSecret } from "./index.js";

export default async function doAddSecret(client: Client, secret: Secret) {
  const { output } = client;
  try {
    const data = await executeAddSecret(client, secret);
    return data;
  } catch (err: unknown) {
    output.error(err as string);
  }
}
