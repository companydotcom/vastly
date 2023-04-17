import { Client } from "../client.js"
import type { Secret } from "./add-secret.js"

interface AddSecretResult {
  message: string
}

export default async function executeAddSecret(
  client: Client,
  secret: Secret,
): Promise<AddSecretResult> {
  const isLocal = true
  try {
    return await client.fetch<AddSecretResult>(
      isLocal
        ? `http://localhost:4000/${secret.environment}/secrets`
        : `https://gunm32peih.execute-api.us-east-1.amazonaws.com/${secret.environment}/secrets`,
      {
        method: "POST",
        body: secret,
      },
    )
  } catch (err: unknown) {
    throw new Error(`Unexpected error: ${err}`)
  }
}
