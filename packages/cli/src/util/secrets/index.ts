import { Secret, SecretResult } from "../../types/index.js";
import { Client } from "../client.js";

export async function executeAddSecret(client: Client, secret: Secret): Promise<SecretResult> {
  try {
    return await client.fetch<SecretResult>(
      `https://96dcyft9wj.execute-api.us-east-1.amazonaws.com/${secret.environment}/secrets`,
      {
        method: "POST",
        body: secret,
      },
    );
  } catch (err: unknown) {
    throw new Error(`Unexpected error: ${err}`);
  }
}

export async function executeDeleteSecret(client: Client, secret: Secret): Promise<SecretResult> {
  try {
    return await client.fetch<SecretResult>(
      `https://96dcyft9wj.execute-api.us-east-1.amazonaws.com/${secret.environment}/secrets`,
      {
        method: "DELETE",
        body: secret.secretKey,
      },
    );
  } catch (err: unknown) {
    throw new Error(`Unexpected error: ${err}`);
  }
}

export async function executeGetAllSecrets(
  client: Client,
  { environment, directory }: { environment: string; directory: string[] },
): Promise<Secret[]> {
  try {
    return await client.fetch<Secret[]>(
      `https://96dcyft9wj.execute-api.us-east-1.amazonaws.com/${environment}/secrets`,
      {
        method: "GET",
      },
    );
  } catch (err: unknown) {
    throw new Error(`Unexpected error: ${err}`);
  }
}
