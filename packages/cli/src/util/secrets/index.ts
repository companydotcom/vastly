import { Secret, SecretResult } from "../../types/index.js";
import { Client } from "../client.js";

export async function executeAddSecret(client: Client, secret: Secret): Promise<SecretResult> {
  const isLocal = true; // change when pinging lambdas
  try {
    return await client.fetch<SecretResult>(
      isLocal
        ? `http://localhost:4000/${secret.environment}/secrets`
        : `https://96dcyft9wj.execute-api.us-east-1.amazonaws.com/${secret.environment}/secrets`,
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
  const isLocal = true; // change when pinging lambdas
  try {
    return await client.fetch<SecretResult>(
      isLocal
        ? `http://localhost:4000/${secret.environment}/secrets`
        : `https://96dcyft9wj.execute-api.us-east-1.amazonaws.com/${secret.environment}/secrets`,
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
  const isLocal = true; // change when pinging lambdas
  try {
    return await client.fetch<Secret[]>(
      isLocal
        ? `http://localhost:4000/${environment}/secrets`
        : `https://96dcyft9wj.execute-api.us-east-1.amazonaws.com/${environment}/secrets`,
      {
        method: "GET",
        // body: {
        //   // TODO: send directory params here
        // },
      },
    );
  } catch (err: unknown) {
    throw new Error(`Unexpected error: ${err}`);
  }
}
