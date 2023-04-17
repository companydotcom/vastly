import { Client } from "../client.js"
import executeLogin from "./execute-login.js"

export default async function doEmailLogin(client: Client, email: string) {
  const { output } = client
  console.log("👾 ~ doEmailLogin ~ email:", email)
  try {
    const data = await executeLogin(client, email)
    console.log(data)
    // verificationToken = data.token
    // securityCode = data.securityCode
    return data
  } catch (err: unknown) {
    output.error(err as string)
  }
}
