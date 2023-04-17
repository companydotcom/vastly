import { Client } from "../client.js"
import type { Secret } from "./add-secret.js"

interface AddSecretResult {
  message: string
}

export default async function executeAddSecret(
  client: Client,
  secret: Secret,
): Promise<AddSecretResult> {
  let func: any
  try {
    func = (await import("../../../../../services/environment/functions/index.js")).default

    const secretToString = JSON.stringify(secret)
    return await client.fetch<AddSecretResult>(
      `https://gxmblcgqcb.execute-api.us-east-1.amazonaws.com/dev/login`,
      {
        method: "POST",
        body: {
          secretToString,
        },
      },
    )
  } catch (err: unknown) {
    throw new Error(`Unexpected error: ${err}`)
  }
}
