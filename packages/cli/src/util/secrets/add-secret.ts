import { Client } from "../client.js"
import executeAddSecret from "./execute-secret-commands.js"

export interface Secret {
  secretKey: string
  secretValue: string
}

export default async function doAddSecret(client: Client, secret: Secret) {
  const { output } = client
  try {
    const data = await executeAddSecret(client, secret)
    console.log(data)
    // verificationToken = data.token
    // securityCode = data.securityCode
    return data
  } catch (err: unknown) {
    output.error(err as string)
  }
}
